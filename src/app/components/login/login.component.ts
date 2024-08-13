import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Renderer2 } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var toastr: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  message: string | undefined;
  isSubmitting: boolean = false;

  constructor( private authService: AuthService,private renderer: Renderer2, private el: ElementRef,private router: Router,private cdr: ChangeDetectorRef) {}

  onSubmit(signinForm: NgForm) {
    if (signinForm.valid) {
      this.isSubmitting = false; // Définir l'état de soumission sur vrai
      this.cdr.detectChanges();  // Pour s'assurer que la vue est mise à jour immédiatement
      this.authService.login(signinForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          this.message = response.message;              
          this.router.navigate(['admin/dashboard']).then(() => {
            this.cdr.detectChanges();
            this.showSuccessMessage();
          });
          this.isSubmitting = true; // Réinitialiser l'état de soumission
        },
        error: (err) => {
          console.error(err);
          if (err.status === 0) {
            this.message = "Le service n'est pas disponible. Veuillez réessayer plus tard.";
          } else {
            this.message = err.error.message;
          }
          this.showErrorMessage();
          this.isSubmitting = false; // Réinitialiser l'état de soumission
          this.cdr.detectChanges();  // Pour s'assurer que la vue est mise à jour
        }
      });
    }
  }

  showSuccessMessage() {
    toastr.success(this.message);
  }

  showErrorMessage() {
    toastr.error(this.message);
  }

}
