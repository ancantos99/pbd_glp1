import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Step {
  title: string;
  description: string;
}

interface PricingPlan {
  name: string;
  subtitle: string;
  price: number;
  period: string;
  features: string[];
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  role: string;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-landing',
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  steps: Step[] = [
    {
      title: 'Evaluación en línea',
      description: 'Completa un cuestionario médico seguro sobre tu historial de salud y objetivos. Toma solo 5 minutos.'
    },
    {
      title: 'Revisión médica',
      description: 'Un médico licenciado revisa tu solicitud en 24 horas y determina si eres candidato para GLP-1.'
    },
    {
      title: 'Prescripción y entrega',
      description: 'Recibe tu prescripción y ordenamos tu GLP-1 para entrega en 2-5 días hábiles.'
    }
  ];

  pricingPlans: PricingPlan[] = [
    {
      name: 'Inicio',
      subtitle: 'Para comenzar tu viaje',
      price: 199,
      period: '/mes',
      features: [
        'Evaluación médica',
        'Prescripción digital',
        'Suministro para 4 semanas',
        'Soporte por email',
        'Seguimiento médico básico'
      ]
    },
    {
      name: 'Estándar',
      subtitle: 'Lo más popular',
      price: 349,
      period: '/mes',
      features: [
        'Todo de Inicio',
        'Suministro para 8 semanas',
        'Consultas mensuales con médico',
        'Ajuste de dosis personalizado',
        'Acceso a comunidad privada',
        'Envío prioritario'
      ]
    },
    {
      name: 'Premium',
      subtitle: 'Cuidado completo',
      price: 599,
      period: '/mes',
      features: [
        'Todo de Estándar',
        'Suministro para 12 semanas',
        'Consultas quincenales',
        'Nutrición personalizada',
        'Entrenador de bienestar',
        'Envío gratuito de por vida'
      ]
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'María García',
      text: 'El proceso fue increíblemente simple. En una semana tenía mi prescripción y la entrega fue discreta como prometieron.',
      rating: 5,
      role: 'Paciente verificada'
    },
    {
      name: 'Dr. Carlos López',
      text: 'Como médico, valoro la transparencia y rigor científico. Esta plataforma cumple con todos los estándares.',
      rating: 5,
      role: 'Médico asociado'
    },
    {
      name: 'Ana Martínez',
      text: 'Los precios son reales. No hay sorpresas. El equipo de médicos está siempre disponible para preguntas.',
      rating: 5,
      role: 'Paciente verificada'
    },
    {
      name: 'Juan Rodríguez',
      text: 'Después de años buscando opciones confiables, finalmente encontré un servicio que combina calidad y accesibilidad.',
      rating: 5,
      role: 'Paciente verificada'
    }
  ];

  faqs: FAQ[] = [
    {
      id: 1,
      question: '¿Es seguro comprar GLP-1 en línea?',
      answer: 'Sí, nuestro servicio requiere prescripción médica verificada de médicos licenciados. Todos nuestros medicamentos provienen de farmacias certificadas y cumplen con regulaciones federales.',
      open: false
    },
    {
      id: 2,
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Una vez aprobada tu prescripción, la entrega típicamente ocurre en 2-5 días hábiles dependiendo de tu ubicación. Oferecemos envío prioritario en planes Estándar y Premium.',
      open: false
    },
    {
      id: 3,
      question: '¿Cubierto por seguros?',
      answer: 'Muchas aseguradoras cubren GLP-1 con prescripción válida. Te recomendamos contactar a tu aseguradora. Ofrecemos planes sin seguro a precios transparentes.',
      open: false
    },
    {
      id: 4,
      question: '¿Quién puede usar GLP-1?',
      answer: 'GLP-1 está indicado para adultos con índice de masa corporal ≥27 kg/m² con afecciones relacionadas al peso. Un médico determinará tu elegibilidad durante la evaluación.',
      open: false
    },
    {
      id: 5,
      question: '¿Hay seguimiento médico continuo?',
      answer: 'Sí. Todos nuestros planes incluyen seguimiento médico. Los planes Estándar y Premium incluyen consultas regulares para monitorear tu progreso y ajustar la dosis.',
      open: false
    },
    {
      id: 6,
      question: '¿Cómo sé que los médicos son licenciados?',
      answer: 'Todos nuestros médicos son licenciados en sus estados respectivos. Verificamos credenciales antes de permitir que realicen evaluaciones y prescripciones.',
      open: false
    }
  ];

  constructor(private router: Router) {}

  goToIntake(): void {
    this.router.navigate(['/intake']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleFaq(id: number): void {
    const faq = this.faqs.find(f => f.id === id);
    if (faq) {
      faq.open = !faq.open;
    }
  }
}
