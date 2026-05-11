import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';

interface FormData {
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

@Component({
  selector: 'app-intake',
  imports: [CommonModule, FormsModule],
  templateUrl: './intake.html',
  styleUrl: './intake.css',
})
export class Intake {
  currentStep = signal(1);
  totalSteps = 7;
  animating = signal(false);
  submitted = signal(false);
  sending = signal(false);
  sendError = signal<string | null>(null);

  formData: FormData = {
    nombre: '',
    apellido: '',
    email: '',
    fechaNacimiento: '',
    sexo: '',
    unidadEstatura: 'imperial',
    estaturaPies: null,
    estaturaPulgadas: null,
    estaturaCm: null,
    unidadPeso: 'lb',
    peso: null,
    historiasPeso: [],
    condicionesMedicas: [],
    antecedentesTimoide: '',
    embarazada: '',
    abusanSustancias: '',
    alergias: '',
    medicamentosPresion: '',
    nivelMotivacion: '',
  };

  progress = computed(() => ((this.currentStep() - 1) / (this.totalSteps - 1)) * 100);

  stepTitles = [
    'Datos Personales',
    'Medidas Físicas',
    'Historia de Peso',
    'Historial Médico',
    'Preguntas de Seguridad',
    'Alergias y Medicamentos',
    'Tu Motivación',
  ];

  historiasPesoOpciones = [
    { value: 'dietas_fallidas', label: 'He intentado dietas y ejercicio sin éxito a largo plazo.' },
    { value: 'salud_afectada', label: 'Mi peso está afectando mi salud física (dolor articular, apnea del sueño, etc.).' },
    { value: 'medicamentos_previos', label: 'He utilizado medicamentos recetados para bajar de peso anteriormente.' },
    { value: 'solucion_medica', label: 'Busco una solución médica para controlar el apetito y la saciedad.' },
  ];

  condicionesMedicasOpciones = [
    { value: 'diabetes1', label: 'Diabetes Tipo 1' },
    { value: 'diabetes2', label: 'Diabetes Tipo 2' },
    { value: 'prediabetes', label: 'Prediabetes o Resistencia a la Insulina' },
    { value: 'renal', label: 'Enfermedad Renal (Problemas en los riñones)' },
    { value: 'pancreatitis', label: 'Pancreatitis (Inflamación del páncreas)' },
    { value: 'cancer_tiroides', label: 'Cáncer Medular de Tiroides (Personal o familiar)' },
    { value: 'men2', label: 'Síndrome de Neoplasia Endocrina Múltiple tipo 2 (MEN 2)' },
    { value: 'retinopatia', label: 'Retinopatía Diabética (Problemas de visión por diabetes)' },
    { value: 'gastroparesia', label: 'Problemas Gastrointestinales graves (como gastroparesia)' },
    { value: 'hepatica', label: 'Enfermedad Hepática (Problemas de hígado)' },
    { value: 'tca', label: 'Trastornos de la conducta alimentaria (Anorexia, Bulimia)' },
    { value: 'embarazo', label: 'Embarazo, lactancia o planes de quedar embarazada en los próximos 3 meses' },
    { value: 'ninguna', label: 'Ninguna de las anteriores' },
  ];

  motivaciones = [
    { value: 'baja', label: 'Solo tengo curiosidad.', color: '#22c55e', emoji: '🟢', nivel: 'Baja' },
    { value: 'moderada', label: 'He pensado en esto por un tiempo.', color: '#eab308', emoji: '🟡', nivel: 'Moderada' },
    { value: 'alta', label: 'Estoy listo para comprometerme con un cambio.', color: '#f97316', emoji: '🟠', nivel: 'Alta' },
    { value: 'muy_alta', label: 'Es mi prioridad número uno en este momento.', color: '#ef4444', emoji: '🔴', nivel: 'Muy Alta' },
  ];

  isStepValid(): boolean {
    const step = this.currentStep();
    switch (step) {
      case 1:
        return !!(this.formData.nombre.trim() && this.formData.apellido.trim() && this.isValidEmail(this.formData.email) && this.formData.fechaNacimiento && this.formData.sexo);
      case 2:
        if (this.formData.unidadEstatura === 'imperial') {
          return !!(this.formData.estaturaPies && this.formData.peso);
        }
        return !!(this.formData.estaturaCm && this.formData.peso);
      case 3:
        return this.formData.historiasPeso.length > 0;
      case 4:
        return this.formData.condicionesMedicas.length > 0;
      case 5:
        return !!(this.formData.antecedentesTimoide && this.formData.embarazada && this.formData.abusanSustancias);
      case 6:
        return !!(this.formData.medicamentosPresion);
      case 7:
        return !!this.formData.nivelMotivacion;
      default:
        return false;
    }
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  toggleHistoriaPeso(value: string) {
    const idx = this.formData.historiasPeso.indexOf(value);
    if (idx === -1) {
      this.formData.historiasPeso = [...this.formData.historiasPeso, value];
    } else {
      this.formData.historiasPeso = this.formData.historiasPeso.filter(v => v !== value);
    }
  }

  toggleCondicion(value: string) {
    if (value === 'ninguna') {
      this.formData.condicionesMedicas = ['ninguna'];
      return;
    }
    const filtered = this.formData.condicionesMedicas.filter(v => v !== 'ninguna');
    const idx = filtered.indexOf(value);
    if (idx === -1) {
      this.formData.condicionesMedicas = [...filtered, value];
    } else {
      this.formData.condicionesMedicas = filtered.filter(v => v !== value);
    }
  }

  isCondicionSelected(value: string): boolean {
    return this.formData.condicionesMedicas.includes(value);
  }

  isHistoriaSelected(value: string): boolean {
    return this.formData.historiasPeso.includes(value);
  }

  goNext() {
    if (!this.isStepValid() || this.animating()) return;
    this.animating.set(true);
    setTimeout(() => {
      this.currentStep.update(s => s + 1);
      this.animating.set(false);
    }, 280);
  }

  goBack() {
    if (this.currentStep() <= 1 || this.animating()) return;
    this.animating.set(true);
    setTimeout(() => {
      this.currentStep.update(s => s - 1);
      this.animating.set(false);
    }, 280);
  }

  async submit() {
    if (!this.isStepValid() || this.sending()) return;
    this.sending.set(true);
    this.sendError.set(null);
    try {
      await this.emailService.sendEvaluation(this.formData);
      this.submitted.set(true);
    } catch {
      this.sendError.set('Hubo un error al enviar. Por favor intenta de nuevo.');
    } finally {
      this.sending.set(false);
    }
  }

  constructor(private router: Router, private emailService: EmailService) {}

  goToLanding() {
    this.router.navigate(['/landing']);
  }
}
