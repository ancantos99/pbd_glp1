import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface IntakeFormData {
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  sexo: string;
  unidadEstatura: 'imperial' | 'metric';
  estaturaPies: number | null;
  estaturaPulgadas: number | null;
  estaturaCm: number | null;
  unidadPeso: 'lb' | 'kg';
  peso: number | null;
  historiasPeso: string[];
  condicionesMedicas: string[];
  antecedentesTimoide: string;
  embarazada: string;
  abusanSustancias: string;
  alergias: string;
  medicamentosPresion: string;
  nivelMotivacion: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  private platformId = inject(PLATFORM_ID);

  private readonly HISTORIAS_MAP: Record<string, string> = {
    dietas_fallidas: 'He intentado dietas y ejercicio sin éxito a largo plazo.',
    salud_afectada: 'Mi peso está afectando mi salud física (dolor articular, apnea del sueño, etc.).',
    medicamentos_previos: 'He utilizado medicamentos recetados para bajar de peso anteriormente.',
    solucion_medica: 'Busco una solución médica para controlar el apetito y la saciedad.',
  };

  private readonly CONDICIONES_MAP: Record<string, string> = {
    diabetes1: 'Diabetes Tipo 1',
    diabetes2: 'Diabetes Tipo 2',
    prediabetes: 'Prediabetes o Resistencia a la Insulina',
    renal: 'Enfermedad Renal (Problemas en los riñones)',
    pancreatitis: 'Pancreatitis (Inflamación del páncreas)',
    cancer_tiroides: 'Cáncer Medular de Tiroides (Personal o familiar)',
    men2: 'Síndrome de Neoplasia Endocrina Múltiple tipo 2 (MEN 2)',
    retinopatia: 'Retinopatía Diabética (Problemas de visión por diabetes)',
    gastroparesia: 'Problemas Gastrointestinales graves (como gastroparesia)',
    hepatica: 'Enfermedad Hepática (Problemas de hígado)',
    tca: 'Trastornos de la conducta alimentaria (Anorexia, Bulimia)',
    embarazo: 'Embarazo, lactancia o planes de quedar embarazada en los próximos 3 meses',
    ninguna: 'Ninguna de las anteriores',
  };

  private readonly MOTIVACION_MAP: Record<string, string> = {
    baja: '🟢 Baja — Solo tengo curiosidad.',
    moderada: '🟡 Moderada — He pensado en esto por un tiempo.',
    alta: '🟠 Alta — Estoy listo para comprometerme con un cambio.',
    muy_alta: '🔴 Muy Alta — Es mi prioridad número uno en este momento.',
  };

  private formatEstatura(data: IntakeFormData): string {
    if (data.unidadEstatura === 'imperial') {
      return `${data.estaturaPies ?? 0} pies ${data.estaturaPulgadas ?? 0} pulgadas`;
    }
    return `${data.estaturaCm} cm`;
  }

  private buildHtmlBody(data: IntakeFormData): string {
    const yesNo = (v: string) => (v === 'si' ? '✅ Sí' : '❌ No');
    const historias = data.historiasPeso.map(h => `<li>${this.HISTORIAS_MAP[h] ?? h}</li>`).join('');
    const condiciones = data.condicionesMedicas.map(c => `<li>${this.CONDICIONES_MAP[c] ?? c}</li>`).join('');

    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a2e1a; background: #f5f7f4; margin: 0; padding: 0; }
  .wrapper { max-width: 640px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .header { background: #1d4a1d; padding: 32px 40px; text-align: center; }
  .header h1 { color: #fff; margin: 0; font-size: 1.5rem; letter-spacing: .05em; }
  .header p { color: #a8d5a8; margin: 6px 0 0; font-size: .9rem; }
  .body { padding: 32px 40px; }
  .section-title { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: #2d6a2d; margin: 28px 0 12px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 10px 14px; font-size: .88rem; border-bottom: 1px solid #eef3ee; }
  td:first-child { font-weight: 600; color: #3a5a3a; width: 42%; }
  td:last-child { color: #1a2e1a; }
  tr:last-child td { border-bottom: none; }
  .table-wrap { background: #f8fbf8; border-radius: 10px; overflow: hidden; border: 1px solid #e0e8e0; }
  ul { margin: 4px 0; padding-left: 20px; }
  li { font-size: .88rem; margin-bottom: 4px; line-height: 1.5; }
  .footer { background: #f5f7f4; padding: 20px 40px; text-align: center; }
  .footer p { font-size: .78rem; color: #6b8a6b; margin: 0; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>GLP-1 — Nueva Evaluación Médica</h1>
    <p>Recibida el ${new Date().toLocaleDateString('es-EC', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
  </div>
  <div class="body">

    <div class="section-title">Datos Personales</div>
    <div class="table-wrap">
      <table>
        <tr><td>Nombre completo</td><td>${data.nombre} ${data.apellido}</td></tr>
        <tr><td>Correo electrónico</td><td>${data.email}</td></tr>
        <tr><td>Fecha de nacimiento</td><td>${data.fechaNacimiento}</td></tr>
        <tr><td>Sexo biológico</td><td>${data.sexo === 'masculino' ? 'Hombre' : 'Mujer'}</td></tr>
      </table>
    </div>

    <div class="section-title">Medidas Físicas</div>
    <div class="table-wrap">
      <table>
        <tr><td>Estatura</td><td>${this.formatEstatura(data)}</td></tr>
        <tr><td>Peso actual</td><td>${data.peso} ${data.unidadPeso}</td></tr>
      </table>
    </div>

    <div class="section-title">Historia de Peso</div>
    <div class="table-wrap" style="padding: 12px 16px;">
      <ul>${historias}</ul>
    </div>

    <div class="section-title">Historial Médico</div>
    <div class="table-wrap" style="padding: 12px 16px;">
      <ul>${condiciones}</ul>
    </div>

    <div class="section-title">Preguntas de Seguridad</div>
    <div class="table-wrap">
      <table>
        <tr><td>Antecedentes familiares de Cáncer Medular de Tiroides</td><td>${yesNo(data.antecedentesTimoide)}</td></tr>
        <tr><td>Embarazada o planea estarlo (próximos 3 meses)</td><td>${yesNo(data.embarazada)}</td></tr>
        <tr><td>Problemas activos de abuso de sustancias</td><td>${yesNo(data.abusanSustancias)}</td></tr>
      </table>
    </div>

    <div class="section-title">Alergias y Medicamentos</div>
    <div class="table-wrap">
      <table>
        <tr><td>Alergias a medicamentos</td><td>${data.alergias || 'Ninguna indicada'}</td></tr>
        <tr><td>Medicamentos para presión / diabetes</td><td>${yesNo(data.medicamentosPresion)}</td></tr>
      </table>
    </div>

    <div class="section-title">Motivación</div>
    <div class="table-wrap">
      <table>
        <tr><td>Nivel de urgencia</td><td>${this.MOTIVACION_MAP[data.nivelMotivacion] ?? data.nivelMotivacion}</td></tr>
      </table>
    </div>

  </div>
  <div class="footer">
    <p>Este correo fue generado automáticamente por el sistema de evaluación GLP-1.<br/>Información confidencial — solo para uso médico interno.</p>
  </div>
</div>
</body>
</html>`;
  }

  async sendEvaluation(data: IntakeFormData): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const emailjs = await import('@emailjs/browser');

    const htmlBody = this.buildHtmlBody(data);

    const templateParams = {
      to_email: environment.adminEmail,
      cc_email: data.email,
      patient_name: `${data.nombre} ${data.apellido}`,
      patient_email: data.email,
      message_html: htmlBody,
    };

    await emailjs.send(
      environment.emailjs.serviceId,
      environment.emailjs.templateId,
      templateParams,
      { publicKey: environment.emailjs.publicKey }
    );
  }
}
