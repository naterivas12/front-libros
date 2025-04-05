import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div [class]="'skeleton-loading skeleton-' + type" [style.width]="width" [style.height]="height">
      <div class="skeleton-shimmer"></div>
    </div>
  `,
  styles: [`
    .skeleton-loading {
      position: relative;
      overflow: hidden;
      background: #e2e5e7;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    .skeleton-text {
      height: 20px;
    }

    .skeleton-title {
      height: 32px;
    }

    .skeleton-card {
      height: 200px;
    }

    .skeleton-circle {
      border-radius: 50%;
    }

    .skeleton-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: shimmer 1.5s infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'text' | 'title' | 'card' | 'circle' = 'text';
  @Input() width = '100%';
  @Input() height?: string;
}
