import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'aether-not-found',
  template: `
    <div class="not-found">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist or has been moved.</p>
      <a routerLink="/dashboard" class="home-btn">Go to Dashboard</a>
    </div>
  `,
  styles: [
    `
    .not-found {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }
    .error-code {
      font-size: 120px;
      font-weight: 800;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0 0 12px;
      color: #0f172a;
      font-size: 28px;
    }
    p {
      margin: 0 0 32px;
      color: #64748b;
      font-size: 16px;
      max-width: 400px;
    }
    .home-btn {
      display: inline-block;
      padding: 12px 32px;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color .2s;
    }
    .home-btn:hover {
      background: #2563eb;
    }
    `,
  ],
})
export class NotFoundComponent {}
