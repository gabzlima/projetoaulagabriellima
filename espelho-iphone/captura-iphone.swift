// Captura a tela do iPhone ligado por USB (macOS) e escreve quadros JPEG na saída padrão.
// Cada quadro: 4 bytes (tamanho, big-endian) + JPEG. Uso: captura-iphone [nome] [fps] [largura]
import AVFoundation
import CoreMediaIO
import CoreImage
import Foundation

let args = Array(CommandLine.arguments.dropFirst())
let filtro = (args.count > 0 ? args[0] : "").lowercased()
let fps = Double(args.count > 1 ? args[1] : "") ?? 20
let largura = CGFloat(Double(args.count > 2 ? args[2] : "") ?? 720)

func log(_ s: String) { FileHandle.standardError.write((s + "\n").data(using: .utf8)!) }

// Sem isto o macOS esconde a tela do iPhone (é o que o QuickTime e o OBS fazem).
var endereco = CMIOObjectPropertyAddress(
    mSelector: CMIOObjectPropertySelector(kCMIOHardwarePropertyAllowScreenCaptureDevices),
    mScope: CMIOObjectPropertyScope(kCMIOObjectPropertyScopeGlobal),
    mElement: CMIOObjectPropertyElement(kCMIOObjectPropertyElementMain))
var permitir: UInt32 = 1
CMIOObjectSetPropertyData(CMIOObjectID(kCMIOObjectSystemObject), &endereco, 0, nil,
                          UInt32(MemoryLayout<UInt32>.size), &permitir)

func acharDispositivo() -> AVCaptureDevice? {
    let todos = AVCaptureDevice.devices(for: .muxed)
    return todos.first { filtro.isEmpty || $0.localizedName.lowercased().contains(filtro) }
}

final class Saida: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    let ctx = CIContext()
    var ultimo = Date.distantPast
    func captureOutput(_ output: AVCaptureOutput, didOutput sb: CMSampleBuffer, from c: AVCaptureConnection) {
        let agora = Date()
        guard agora.timeIntervalSince(ultimo) >= 1.0 / fps else { return }
        ultimo = agora
        guard let pb = CMSampleBufferGetImageBuffer(sb) else { return }
        var img = CIImage(cvPixelBuffer: pb)
        let esc = largura / img.extent.width
        if esc < 1 { img = img.transformed(by: CGAffineTransform(scaleX: esc, y: esc)) }
        guard let cores = CGColorSpace(name: CGColorSpace.sRGB),
              let jpg = ctx.jpegRepresentation(of: img, colorSpace: cores, options: [:]) else { return }
        var n = UInt32(jpg.count).bigEndian
        var quadro = Data(bytes: &n, count: 4)
        quadro.append(jpg)
        FileHandle.standardOutput.write(quadro)
    }
}

AVCaptureDevice.requestAccess(for: .video) { ok in
    if !ok { log("Sem permissão de câmera. Ative o Terminal em Ajustes > Privacidade e Segurança > Câmera."); exit(2) }
}

var dispositivo: AVCaptureDevice? = nil
for _ in 0..<20 { // espera até 10 s o iPhone aparecer
    dispositivo = acharDispositivo()
    if dispositivo != nil { break }
    Thread.sleep(forTimeInterval: 0.5)
}
guard let disp = dispositivo else {
    let nomes = AVCaptureDevice.devices(for: .muxed).map { $0.localizedName }
    log("Tela do iPhone não encontrada. Dispositivos de tela vistos: \(nomes). Desbloqueie o iPhone e toque em Confiar.")
    exit(3)
}
log("Capturando: \(disp.localizedName)")

NotificationCenter.default.addObserver(forName: .AVCaptureDeviceWasDisconnected, object: disp, queue: nil) { _ in exit(4) }

let sessao = AVCaptureSession()
let saida = AVCaptureVideoDataOutput()
saida.alwaysDiscardsLateVideoFrames = true
let delegado = Saida()
saida.setSampleBufferDelegate(delegado, queue: DispatchQueue(label: "quadros"))
do {
    sessao.addInput(try AVCaptureDeviceInput(device: disp))
} catch {
    log("Não consegui abrir o iPhone: \(error)")
    exit(5)
}
sessao.addOutput(saida)
sessao.startRunning()
RunLoop.main.run()
