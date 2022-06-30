var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, NgZone, OnDestroy, OnInit, TemplateRef, ViewEncapsulation, ChangeDetectorRef, ViewRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NotificationsService } from '../../services/notifications.service';
let NotificationComponent = class NotificationComponent {
    constructor(notificationService, domSanitizer, cd, zone) {
        this.notificationService = notificationService;
        this.domSanitizer = domSanitizer;
        this.cd = cd;
        this.zone = zone;
        this.titleIsTemplate = false;
        this.contentIsTemplate = false;
        this.htmlIsTemplate = false;
        this.progressWidth = 0;
        this.stopTime = false;
        this.framesPerSecond = 40;
        this.instance = () => {
            const now = new Date().getTime();
            if (this.endTime < now) {
                this.remove();
                this.item.timeoutEnd.emit();
            }
            else if (!this.stopTime) {
                if (this.showProgressBar) {
                    // We add this.sleepTime just to have 100% before close
                    this.progressWidth = Math.min((now - this.startTime + this.sleepTime) * 100 / this.timeOut, 100);
                }
                this.timer = setTimeout(this.instance, this.sleepTime);
            }
            this.zone.run(() => {
                if (!this.cd.destroyed) {
                    this.cd.detectChanges();
                }
            });
        };
    }
    ngOnInit() {
        if (this.item.override) {
            this.attachOverrides();
        }
        if (this.animate) {
            this.item.state = this.animate;
        }
        if (this.timeOut !== 0) {
            this.startTimeOut();
        }
        this.contentType(this.item.title, 'title');
        this.contentType(this.item.content, 'content');
        this.contentType(this.item.html, 'html');
        this.safeSvg = this.domSanitizer.bypassSecurityTrustHtml(this.icon || this.item.icon);
        this.safeInputHtml = this.domSanitizer.bypassSecurityTrustHtml(this.item.html);
    }
    ngOnDestroy() {
        clearTimeout(this.timer);
        this.cd.detach();
    }
    startTimeOut() {
        this.sleepTime = 1000 / this.framesPerSecond /* ms */;
        this.startTime = new Date().getTime();
        this.endTime = this.startTime + this.timeOut;
        this.zone.runOutsideAngular(() => this.timer = setTimeout(this.instance, this.sleepTime));
    }
    onEnter() {
        if (this.pauseOnHover) {
            this.stopTime = true;
            this.pauseStart = new Date().getTime();
        }
    }
    onLeave() {
        if (this.pauseOnHover) {
            this.stopTime = false;
            this.startTime += (new Date().getTime() - this.pauseStart);
            this.endTime += (new Date().getTime() - this.pauseStart);
            this.zone.runOutsideAngular(() => setTimeout(this.instance, this.sleepTime));
        }
    }
    onClick(event) {
        this.item.click.emit(event);
        if (this.clickToClose) {
            this.remove();
        }
    }
    onClickIcon(event) {
        this.item.clickIcon.emit(event);
        if (this.clickIconToClose) {
            this.remove();
        }
    }
    // Attach all the overrides
    attachOverrides() {
        Object.keys(this.item.override).forEach(a => {
            if (this.hasOwnProperty(a)) {
                this[a] = this.item.override[a];
            }
        });
    }
    remove() {
        if (this.animate) {
            this.item.state = this.animate + 'Out';
            setTimeout(() => {
                this.notificationService.set(this.item, false);
            }, 310);
        }
        else {
            setTimeout(() => {
                this.notificationService.set(this.item, false);
            }, 5310);
        }
    }
    contentType(item, key) {
        if (item instanceof TemplateRef) {
            this[key] = item;
        }
        else {
            this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
        }
        this[key + 'IsTemplate'] = item instanceof TemplateRef;
    }
};
NotificationComponent.ctorParameters = () => [
    { type: NotificationsService },
    { type: DomSanitizer },
    { type: ChangeDetectorRef },
    { type: NgZone }
];
__decorate([
    Input()
], NotificationComponent.prototype, "timeOut", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "showProgressBar", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "pauseOnHover", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "clickToClose", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "clickIconToClose", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "maxLength", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "theClass", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "rtl", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "animate", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "position", void 0);
__decorate([
    Input()
], NotificationComponent.prototype, "item", void 0);
NotificationComponent = __decorate([
    Component({
        selector: 'simple-notification',
        encapsulation: ViewEncapsulation.None,
        animations: [
            trigger('enterLeave', [
                // Fade
                state('fade', style({ opacity: 1, bottom: '-20px' })),
                transition('* => fade', [
                    style({ opacity: 0 }),
                    animate('1000ms ease-in-out')
                ]),
                state('fadeOut', style({ opacity: 0, bottom: '-400px' })),
                transition('fade => fadeOut', [
                    style({ opacity: 1 }),
                    animate('1000ms ease-in-out')
                ]),
                // Enter from top
                state('fromTop', style({ opacity: 1, transform: 'translateY(0)' })),
                transition('* => fromTop', [
                    style({ opacity: 0, transform: 'translateY(-5%)' }),
                    animate('400ms ease-in-out')
                ]),
                state('fromTopOut', style({ opacity: 0, transform: 'translateY(5%)' })),
                transition('fromTop => fromTopOut', [
                    style({ opacity: 1, transform: 'translateY(0)' }),
                    animate('300ms ease-in-out')
                ]),
                // Enter from right
                state('fromRight', style({ opacity: 1, transform: 'translateX(0)' })),
                transition('* => fromRight', [
                    style({ opacity: 0, transform: 'translateX(5%)' }),
                    animate('400ms ease-in-out')
                ]),
                state('fromRightOut', style({ opacity: 0, transform: 'translateX(-5%)' })),
                transition('fromRight => fromRightOut', [
                    style({ opacity: 1, transform: 'translateX(0)' }),
                    animate('300ms ease-in-out')
                ]),
                // Enter from bottom
                state('fromBottom', style({ opacity: 1, transform: 'translateY(0)' })),
                transition('* => fromBottom', [
                    style({ opacity: 0, transform: 'translateY(5%)' }),
                    animate('400ms ease-in-out')
                ]),
                state('fromBottomOut', style({ opacity: 0, transform: 'translateY(-5%)' })),
                transition('fromBottom => fromBottomOut', [
                    style({ opacity: 1, transform: 'translateY(0)' }),
                    animate('300ms ease-in-out')
                ]),
                // Enter from left
                state('fromLeft', style({ opacity: 1, transform: 'translateX(0)' })),
                transition('* => fromLeft', [
                    style({ opacity: 0, transform: 'translateX(-5%)' }),
                    animate('400ms ease-in-out')
                ]),
                state('fromLeftOut', style({ opacity: 0, transform: 'translateX(5%)' })),
                transition('fromLeft => fromLeftOut', [
                    style({ opacity: 1, transform: 'translateX(0)' }),
                    animate('300ms ease-in-out')
                ]),
                // Rotate
                state('scale', style({ opacity: 1, transform: 'scale(1)' })),
                transition('* => scale', [
                    style({ opacity: 0, transform: 'scale(0)' }),
                    animate('400ms ease-in-out')
                ]),
                state('scaleOut', style({ opacity: 0, transform: 'scale(0)' })),
                transition('scale => scaleOut', [
                    style({ opacity: 1, transform: 'scale(1)' }),
                    animate('400ms ease-in-out')
                ]),
                // Scale
                state('rotate', style({ opacity: 1, transform: 'rotate(0deg)' })),
                transition('* => rotate', [
                    style({ opacity: 0, transform: 'rotate(5deg)' }),
                    animate('400ms ease-in-out')
                ]),
                state('rotateOut', style({ opacity: 0, transform: 'rotate(-5deg)' })),
                transition('rotate => rotateOut', [
                    style({ opacity: 1, transform: 'rotate(0deg)' }),
                    animate('400ms ease-in-out')
                ])
            ])
        ],
        template: "<div class=\"simple-notification\"\n     [@enterLeave]=\"item.state\"\n     (click)=\"onClick($event)\"\n     [class]=\"theClass\"\n     [ngClass]=\"{\n            'alert': item.type === 'alert',\n            'error': item.type === 'error',\n            'warn': item.type === 'warn',\n            'success': item.type === 'success',\n            'info': item.type === 'info',\n            'bare': item.type === 'bare',\n            'rtl-mode': rtl,\n            'has-icon': item.icon !== 'bare'\n        }\"\n     (mouseenter)=\"onEnter()\"\n     (mouseleave)=\"onLeave()\">\n\n    <div *ngIf=\"!item.html\">\n\n        <div class=\"sn-title\" *ngIf=\"titleIsTemplate; else regularTitle\">\n            <ng-container *ngTemplateOutlet=\"title; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularTitle>\n            <div class=\"sn-title\" [innerHTML]=\"title\"></div>\n        </ng-template>\n\n        <div class=\"sn-content\" *ngIf=\"contentIsTemplate else regularContent\">\n            <ng-container *ngTemplateOutlet=\"content; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularContent>\n            <div class=\"sn-content\" [innerHTML]=\"content\"></div>\n        </ng-template>\n\n        <div class=\"icon\" *ngIf=\"item.icon !== 'bare'\" [innerHTML]=\"safeSvg\"></div>\n    </div>\n    <div *ngIf=\"item.html\">\n        <div class=\"sn-html\" *ngIf=\"htmlIsTemplate; else regularHtml\">\n            <ng-container *ngTemplateOutlet=\"item.html; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularHtml>\n            <div class=\"sn-content\" [innerHTML]=\"safeInputHtml\"></div>\n        </ng-template>\n\n        <div class=\"icon\" [class.icon-hover]=\"clickIconToClose\" *ngIf=\"item.icon\" [innerHTML]=\"safeSvg\" (click)=\"onClickIcon($event)\"></div>\n    </div>\n\n    <div class=\"sn-progress-loader\" *ngIf=\"showProgressBar\">\n        <span [ngStyle]=\"{'width': progressWidth + '%'}\"></span>\n    </div>\n\n</div>\n",
        changeDetection: ChangeDetectionStrategy.OnPush,
        styles: [".simple-notification{position:fixed;padding:10px 20px;display:flex;align-items:center;width:520px;min-height:56px;left:50%;bottom:-400px;transform:translateX(-50%);box-sizing:border-box;border-top-left-radius:6px;border-top-right-radius:6px;color:#fff;cursor:pointer;transition:.5s;background:#434f54}.simple-notification .sn-content,.simple-notification .sn-html,.simple-notification .sn-title{margin:0}.simple-notification .sn-title{max-width:314px;font-size:16px;font-style:normal;line-height:1.33;letter-spacing:normal;color:#fff}.simple-notification .sn-content{font-size:16px;line-height:1.33;color:#fff}.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html,.simple-notification.has-icon .sn-title{padding:0 50px 0 0}.simple-notification .icon{position:absolute;width:50px;height:50px;top:55%;right:0;transform:translateY(-50%);box-sizing:border-box}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html,.simple-notification.rtl-mode.has-icon .sn-title{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%;border-radius:6px;background:#00a8ea}"]
    })
], NotificationComponent);
export { NotificationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLW5vdGlmaWNhdGlvbnMvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakssT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUduRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQWtHNUUsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUFxQ2hDLFlBQ1UsbUJBQXlDLEVBQ3pDLFlBQTBCLEVBQzFCLEVBQXFCLEVBQ3JCLElBQVk7UUFIWix3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBQ3pDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLFNBQUksR0FBSixJQUFJLENBQVE7UUF0QnRCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMxQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUV2QixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUlWLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUF5RnJCLGFBQVEsR0FBRyxHQUFHLEVBQUU7WUFD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QUFlLEVBQUMsQ0FBQyxDQUFDO2dCQUNuRSxVQUFVLENBQUMscUJBQXFCLEVBQUU7b0JBQ2hDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBQyxDQUFDO29CQUM5QyxPQUFPLENBQUMsbUJBQW1CLENBQUM7aUJBQzdCLENBQUM7YUFDSCxDQUFDO1NBQ0g7UUFDRCwrZ0VBQTRDO1FBRTVDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNOztLQUNoRCxDQUFDO0dBRVcscUJBQXFCLENBaUtqQztTQWpLWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmLCBWaWV3UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlIH0gZnJvbSAnLi4vLi4vZW51bXMvbm90aWZpY2F0aW9uLWFuaW1hdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub3RpZmljYXRpb24udHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NpbXBsZS1ub3RpZmljYXRpb24nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignZW50ZXJMZWF2ZScsIFtcblxuICAgICAgLy8gRmFkZVxuICAgICAgc3RhdGUoJ2ZhZGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgYm90dG9tOiAnLTIwcHgnfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmYWRlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICAgICBhbmltYXRlKCcxMDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZmFkZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCBib3R0b206ICctNDAwcHgnfSkpLFxuICAgICAgdHJhbnNpdGlvbignZmFkZSA9PiBmYWRlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMX0pLFxuICAgICAgICBhbmltYXRlKCcxMDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gdG9wXG4gICAgICBzdGF0ZSgnZnJvbVRvcCcsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbVRvcCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbVRvcE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tVG9wID0+IGZyb21Ub3BPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSByaWdodFxuICAgICAgc3RhdGUoJ2Zyb21SaWdodCcsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbVJpZ2h0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg1JSknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ2Zyb21SaWdodE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbVJpZ2h0ID0+IGZyb21SaWdodE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBFbnRlciBmcm9tIGJvdHRvbVxuICAgICAgc3RhdGUoJ2Zyb21Cb3R0b20nLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZyb21Cb3R0b20nLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbUJvdHRvbU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbUJvdHRvbSA9PiBmcm9tQm90dG9tT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnMzAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gbGVmdFxuICAgICAgc3RhdGUoJ2Zyb21MZWZ0Jywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tTGVmdCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbUxlZnRPdXQnLCBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg1JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbUxlZnQgPT4gZnJvbUxlZnRPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gUm90YXRlXG4gICAgICBzdGF0ZSgnc2NhbGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBzY2FsZScsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdzY2FsZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdzY2FsZSA9PiBzY2FsZU91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gU2NhbGVcbiAgICAgIHN0YXRlKCdyb3RhdGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gcm90YXRlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAncm90YXRlKDVkZWcpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdyb3RhdGVPdXQnLCBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAncm90YXRlKC01ZGVnKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdyb3RhdGUgPT4gcm90YXRlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKVxuICAgIF0pXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9ub3RpZmljYXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9ub3RpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcblxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKSB0aW1lT3V0OiBudW1iZXI7XG4gIEBJbnB1dCgpIHNob3dQcm9ncmVzc0JhcjogYm9vbGVhbjtcbiAgQElucHV0KCkgcGF1c2VPbkhvdmVyOiBib29sZWFuO1xuICBASW5wdXQoKSBjbGlja1RvQ2xvc2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsaWNrSWNvblRvQ2xvc2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1heExlbmd0aDogbnVtYmVyO1xuICBASW5wdXQoKSB0aGVDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKSBydGw6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFuaW1hdGU6IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGU7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBudW1iZXI7XG4gIEBJbnB1dCgpIGl0ZW06IE5vdGlmaWNhdGlvbjtcblxuXG4gIC8vIFByb2dyZXNzIGJhciB2YXJpYWJsZXNcbiAgdGl0bGU6IGFueTtcbiAgY29udGVudDogYW55O1xuXG4gIHRpdGxlSXNUZW1wbGF0ZSA9IGZhbHNlO1xuICBjb250ZW50SXNUZW1wbGF0ZSA9IGZhbHNlO1xuICBodG1sSXNUZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIHByb2dyZXNzV2lkdGggPSAwO1xuICBzYWZlU3ZnOiBTYWZlSHRtbDtcbiAgc2FmZUlucHV0SHRtbDogU2FmZUh0bWw7XG5cbiAgcHJpdmF0ZSBzdG9wVGltZSA9IGZhbHNlO1xuICBwcml2YXRlIHRpbWVyOiBhbnk7XG4gIHByaXZhdGUgZnJhbWVzUGVyU2Vjb25kID0gNDA7XG4gIHByaXZhdGUgc2xlZXBUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgZW5kVGltZTogbnVtYmVyO1xuICBwcml2YXRlIHBhdXNlU3RhcnQ6IG51bWJlcjtcblxuICBwcml2YXRlIGljb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IE5vdGlmaWNhdGlvbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLml0ZW0ub3ZlcnJpZGUpIHtcbiAgICAgIHRoaXMuYXR0YWNoT3ZlcnJpZGVzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgdGhpcy5pdGVtLnN0YXRlID0gdGhpcy5hbmltYXRlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRpbWVPdXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lT3V0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0udGl0bGUsICd0aXRsZScpO1xuICAgIHRoaXMuY29udGVudFR5cGUodGhpcy5pdGVtLmNvbnRlbnQsICdjb250ZW50Jyk7XG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0uaHRtbCwgJ2h0bWwnKTtcblxuICAgIHRoaXMuc2FmZVN2ZyA9IHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKHRoaXMuaWNvbiB8fCB0aGlzLml0ZW0uaWNvbik7XG4gICAgdGhpcy5zYWZlSW5wdXRIdG1sID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5pdGVtLmh0bWwpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMuY2QuZGV0YWNoKCk7XG4gIH1cblxuICBzdGFydFRpbWVPdXQoKTogdm9pZCB7XG4gICAgdGhpcy5zbGVlcFRpbWUgPSAxMDAwIC8gdGhpcy5mcmFtZXNQZXJTZWNvbmQgLyogbXMgKi87XG4gICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmVuZFRpbWUgPSB0aGlzLnN0YXJ0VGltZSArIHRoaXMudGltZU91dDtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy50aW1lciA9IHNldFRpbWVvdXQodGhpcy5pbnN0YW5jZSwgdGhpcy5zbGVlcFRpbWUpKTtcbiAgfVxuXG4gIG9uRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMucGF1c2VPbkhvdmVyKSB7XG4gICAgICB0aGlzLnN0b3BUaW1lID0gdHJ1ZTtcbiAgICAgIHRoaXMucGF1c2VTdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMucGF1c2VPbkhvdmVyKSB7XG4gICAgICB0aGlzLnN0b3BUaW1lID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXJ0VGltZSArPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnBhdXNlU3RhcnQpO1xuICAgICAgdGhpcy5lbmRUaW1lICs9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMucGF1c2VTdGFydCk7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gc2V0VGltZW91dCh0aGlzLmluc3RhbmNlLCB0aGlzLnNsZWVwVGltZSkpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLml0ZW0uY2xpY2shLmVtaXQoZXZlbnQpO1xuXG4gICAgaWYgKHRoaXMuY2xpY2tUb0Nsb3NlKSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2tJY29uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5pdGVtLmNsaWNrSWNvbiEuZW1pdChldmVudCk7XG5cbiAgICBpZiAodGhpcy5jbGlja0ljb25Ub0Nsb3NlKSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEF0dGFjaCBhbGwgdGhlIG92ZXJyaWRlc1xuICBhdHRhY2hPdmVycmlkZXMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pdGVtLm92ZXJyaWRlKS5mb3JFYWNoKGEgPT4ge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoYSkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVthXSA9IHRoaXMuaXRlbS5vdmVycmlkZVthXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zdGFuY2UgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodGhpcy5lbmRUaW1lIDwgbm93KSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgdGhpcy5pdGVtLnRpbWVvdXRFbmQhLmVtaXQoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0b3BUaW1lKSB7XG4gICAgICBpZiAodGhpcy5zaG93UHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgLy8gV2UgYWRkIHRoaXMuc2xlZXBUaW1lIGp1c3QgdG8gaGF2ZSAxMDAlIGJlZm9yZSBjbG9zZVxuICAgICAgICB0aGlzLnByb2dyZXNzV2lkdGggPSBNYXRoLm1pbigobm93IC0gdGhpcy5zdGFydFRpbWUgKyB0aGlzLnNsZWVwVGltZSkgKiAxMDAgLyB0aGlzLnRpbWVPdXQsIDEwMCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuaW5zdGFuY2UsIHRoaXMuc2xlZXBUaW1lKTtcbiAgICB9XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBpZiAoISh0aGlzLmNkIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgIHRoaXMuaXRlbS5zdGF0ZSA9IHRoaXMuYW5pbWF0ZSArICdPdXQnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uU2VydmljZS5zZXQodGhpcy5pdGVtLCBmYWxzZSk7XG4gICAgICB9LCAzMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLnNldCh0aGlzLml0ZW0sIGZhbHNlKTtcbiAgICAgIH0sIDUzMTApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29udGVudFR5cGUoaXRlbTogYW55LCBrZXk6IHN0cmluZykge1xuICAgIGlmIChpdGVtIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIHRoaXNba2V5XSA9IGl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGl0ZW0pO1xuICAgIH1cblxuICAgIHRoaXNba2V5ICsgJ0lzVGVtcGxhdGUnXSA9IGl0ZW0gaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZjtcbiAgfVxufVxuIl19