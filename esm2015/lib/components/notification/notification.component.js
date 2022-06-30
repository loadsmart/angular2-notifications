import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/notifications.service";
import * as i2 from "@angular/platform-browser";
import * as i3 from "@angular/common";
export class NotificationComponent {
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
}
NotificationComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: NotificationComponent, deps: [{ token: i1.NotificationsService }, { token: i2.DomSanitizer }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NotificationComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.16", type: NotificationComponent, selector: "simple-notification", inputs: { timeOut: "timeOut", showProgressBar: "showProgressBar", pauseOnHover: "pauseOnHover", clickToClose: "clickToClose", clickIconToClose: "clickIconToClose", maxLength: "maxLength", theClass: "theClass", rtl: "rtl", animate: "animate", position: "position", item: "item" }, ngImport: i0, template: "<div class=\"simple-notification\"\n     [@enterLeave]=\"item.state\"\n     (click)=\"onClick($event)\"\n     [class]=\"theClass\"\n     [ngClass]=\"{\n            'alert': item.type === 'alert',\n            'error': item.type === 'error',\n            'warn': item.type === 'warn',\n            'success': item.type === 'success',\n            'info': item.type === 'info',\n            'bare': item.type === 'bare',\n            'rtl-mode': rtl,\n            'has-icon': item.icon !== 'bare'\n        }\"\n     (mouseenter)=\"onEnter()\"\n     (mouseleave)=\"onLeave()\">\n\n    <div *ngIf=\"!item.html\">\n\n        <div class=\"sn-title\" *ngIf=\"titleIsTemplate; else regularTitle\">\n            <ng-container *ngTemplateOutlet=\"title; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularTitle>\n            <div class=\"sn-title\" [innerHTML]=\"title\"></div>\n        </ng-template>\n\n        <div class=\"sn-content\" *ngIf=\"contentIsTemplate else regularContent\">\n            <ng-container *ngTemplateOutlet=\"content; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularContent>\n            <div class=\"sn-content\" [innerHTML]=\"content\"></div>\n        </ng-template>\n\n        <div class=\"icon\" *ngIf=\"item.icon !== 'bare'\" [innerHTML]=\"safeSvg\"></div>\n    </div>\n    <div *ngIf=\"item.html\">\n        <div class=\"sn-html\" *ngIf=\"htmlIsTemplate; else regularHtml\">\n            <ng-container *ngTemplateOutlet=\"item.html; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularHtml>\n            <div class=\"sn-content\" [innerHTML]=\"safeInputHtml\"></div>\n        </ng-template>\n\n        <div class=\"icon\" [class.icon-hover]=\"clickIconToClose\" *ngIf=\"item.icon\" [innerHTML]=\"safeSvg\" (click)=\"onClickIcon($event)\"></div>\n    </div>\n\n    <div class=\"sn-progress-loader\" *ngIf=\"showProgressBar\">\n        <span [ngStyle]=\"{'width': progressWidth + '%'}\"></span>\n    </div>\n\n</div>\n", styles: [".simple-notification{position:fixed;padding:10px 20px;display:flex;align-items:center;width:520px;min-height:56px;left:50%;bottom:-400px;transform:translate(-50%);box-sizing:border-box;border-top-left-radius:6px;border-top-right-radius:6px;color:#fff;cursor:pointer;transition:all .5s;background:#434f54}.simple-notification .sn-title,.simple-notification .sn-content,.simple-notification .sn-html{margin:0}.simple-notification .sn-title{max-width:314px;font-size:16px;font-style:normal;line-height:1.33;letter-spacing:normal;color:#fff}.simple-notification .sn-content{font-size:16px;line-height:1.33;color:#fff}.simple-notification.has-icon .sn-title,.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html{padding:0 50px 0 0}.simple-notification .icon{position:absolute;width:50px;height:50px;top:55%;right:0;transform:translateY(-50%);box-sizing:border-box}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-title,.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%}.simple-notification .sn-progress-loader span{border-radius:6px;background:#00a8ea}\n"], directives: [{ type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
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
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: NotificationComponent, decorators: [{
            type: Component,
            args: [{
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
                    templateUrl: './notification.component.html',
                    styleUrls: ['./notification.component.css'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.NotificationsService }, { type: i2.DomSanitizer }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { timeOut: [{
                type: Input
            }], showProgressBar: [{
                type: Input
            }], pauseOnHover: [{
                type: Input
            }], clickToClose: [{
                type: Input
            }], clickIconToClose: [{
                type: Input
            }], maxLength: [{
                type: Input
            }], theClass: [{
                type: Input
            }], rtl: [{
                type: Input
            }], animate: [{
                type: Input
            }], position: [{
                type: Input
            }], item: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTZCLFdBQVcsRUFBRSxpQkFBaUIsRUFBOEIsTUFBTSxlQUFlLENBQUM7Ozs7O0FBc0dqSyxNQUFNLE9BQU8scUJBQXFCO0lBcUNoQyxZQUNVLG1CQUF5QyxFQUN6QyxZQUEwQixFQUMxQixFQUFxQixFQUNyQixJQUFZO1FBSFosd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFzQjtRQUN6QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBdEJ0QixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFFdkIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFJVixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCLG9CQUFlLEdBQUcsRUFBRSxDQUFDO1FBeUZyQixhQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFakMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcs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RUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLENBQUM7Z0NBQzlDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs2QkFDN0IsQ0FBQzs0QkFDRixLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7NEJBQ25FLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRTtnQ0FDaEMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLENBQUM7Z0NBQzlDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs2QkFDN0IsQ0FBQzt5QkFDSCxDQUFDO3FCQUNIO29CQUNELFdBQVcsRUFBRSwrQkFBK0I7b0JBQzVDLFNBQVMsRUFBRSxDQUFDLDhCQUE4QixDQUFDO29CQUMzQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7MkxBSVUsT0FBTztzQkFBZixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csR0FBRztzQkFBWCxLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUgfSBmcm9tICcuLi8uLi9lbnVtcy9ub3RpZmljYXRpb24tYW5pbWF0aW9uLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vdGlmaWNhdGlvbi50eXBlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2ltcGxlLW5vdGlmaWNhdGlvbicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdlbnRlckxlYXZlJywgW1xuXG4gICAgICAvLyBGYWRlXG4gICAgICBzdGF0ZSgnZmFkZScsIHN0eWxlKHtvcGFjaXR5OiAxLCBib3R0b206ICctMjBweCd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZhZGUnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwfSksXG4gICAgICAgIGFuaW1hdGUoJzEwMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmYWRlT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIGJvdHRvbTogJy00MDBweCd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmYWRlID0+IGZhZGVPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxfSksXG4gICAgICAgIGFuaW1hdGUoJzEwMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSB0b3BcbiAgICAgIHN0YXRlKCdmcm9tVG9wJywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tVG9wJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tVG9wT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoNSUpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ2Zyb21Ub3AgPT4gZnJvbVRvcE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBFbnRlciBmcm9tIHJpZ2h0XG4gICAgICBzdGF0ZSgnZnJvbVJpZ2h0Jywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tUmlnaHQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbVJpZ2h0T3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tUmlnaHQgPT4gZnJvbVJpZ2h0T3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnMzAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gYm90dG9tXG4gICAgICBzdGF0ZSgnZnJvbUJvdHRvbScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbUJvdHRvbScsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tQm90dG9tT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tQm90dG9tID0+IGZyb21Cb3R0b21PdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSBsZWZ0XG4gICAgICBzdGF0ZSgnZnJvbUxlZnQnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZyb21MZWZ0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tTGVmdE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tTGVmdCA9PiBmcm9tTGVmdE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBSb3RhdGVcbiAgICAgIHN0YXRlKCdzY2FsZScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IHNjYWxlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGUoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ3NjYWxlT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ3NjYWxlID0+IHNjYWxlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMSknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBTY2FsZVxuICAgICAgc3RhdGUoJ3JvdGF0ZScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiByb3RhdGUnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdyb3RhdGUoNWRlZyknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ3JvdGF0ZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdyb3RhdGUoLTVkZWcpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ3JvdGF0ZSA9PiByb3RhdGVPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pXG4gICAgXSlcbiAgXSxcbiAgdGVtcGxhdGVVcmw6ICcuL25vdGlmaWNhdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25vdGlmaWNhdGlvbi5jb21wb25lbnQuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpIHRpbWVPdXQ6IG51bWJlcjtcbiAgQElucHV0KCkgc2hvd1Byb2dyZXNzQmFyOiBib29sZWFuO1xuICBASW5wdXQoKSBwYXVzZU9uSG92ZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsaWNrVG9DbG9zZTogYm9vbGVhbjtcbiAgQElucHV0KCkgY2xpY2tJY29uVG9DbG9zZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWF4TGVuZ3RoOiBudW1iZXI7XG4gIEBJbnB1dCgpIHRoZUNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJ0bDogYm9vbGVhbjtcbiAgQElucHV0KCkgYW5pbWF0ZTogTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZTtcbiAgQElucHV0KCkgcG9zaXRpb246IG51bWJlcjtcbiAgQElucHV0KCkgaXRlbTogTm90aWZpY2F0aW9uO1xuXG5cbiAgLy8gUHJvZ3Jlc3MgYmFyIHZhcmlhYmxlc1xuICB0aXRsZTogYW55O1xuICBjb250ZW50OiBhbnk7XG5cbiAgdGl0bGVJc1RlbXBsYXRlID0gZmFsc2U7XG4gIGNvbnRlbnRJc1RlbXBsYXRlID0gZmFsc2U7XG4gIGh0bWxJc1RlbXBsYXRlID0gZmFsc2U7XG5cbiAgcHJvZ3Jlc3NXaWR0aCA9IDA7XG4gIHNhZmVTdmc6IFNhZmVIdG1sO1xuICBzYWZlSW5wdXRIdG1sOiBTYWZlSHRtbDtcblxuICBwcml2YXRlIHN0b3BUaW1lID0gZmFsc2U7XG4gIHByaXZhdGUgdGltZXI6IGFueTtcbiAgcHJpdmF0ZSBmcmFtZXNQZXJTZWNvbmQgPSA0MDtcbiAgcHJpdmF0ZSBzbGVlcFRpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBzdGFydFRpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBlbmRUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgcGF1c2VTdGFydDogbnVtYmVyO1xuXG4gIHByaXZhdGUgaWNvbjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuaXRlbS5vdmVycmlkZSkge1xuICAgICAgdGhpcy5hdHRhY2hPdmVycmlkZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICB0aGlzLml0ZW0uc3RhdGUgPSB0aGlzLmFuaW1hdGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGltZU91dCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydFRpbWVPdXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnRUeXBlKHRoaXMuaXRlbS50aXRsZSwgJ3RpdGxlJyk7XG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0uY29udGVudCwgJ2NvbnRlbnQnKTtcbiAgICB0aGlzLmNvbnRlbnRUeXBlKHRoaXMuaXRlbS5odG1sLCAnaHRtbCcpO1xuXG4gICAgdGhpcy5zYWZlU3ZnID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5pY29uIHx8IHRoaXMuaXRlbS5pY29uKTtcbiAgICB0aGlzLnNhZmVJbnB1dEh0bWwgPSB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLml0ZW0uaHRtbCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy5jZC5kZXRhY2goKTtcbiAgfVxuXG4gIHN0YXJ0VGltZU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNsZWVwVGltZSA9IDEwMDAgLyB0aGlzLmZyYW1lc1BlclNlY29uZCAvKiBtcyAqLztcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuZW5kVGltZSA9IHRoaXMuc3RhcnRUaW1lICsgdGhpcy50aW1lT3V0O1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLnRpbWVyID0gc2V0VGltZW91dCh0aGlzLmluc3RhbmNlLCB0aGlzLnNsZWVwVGltZSkpO1xuICB9XG5cbiAgb25FbnRlcigpIHtcbiAgICBpZiAodGhpcy5wYXVzZU9uSG92ZXIpIHtcbiAgICAgIHRoaXMuc3RvcFRpbWUgPSB0cnVlO1xuICAgICAgdGhpcy5wYXVzZVN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfVxuICB9XG5cbiAgb25MZWF2ZSgpIHtcbiAgICBpZiAodGhpcy5wYXVzZU9uSG92ZXIpIHtcbiAgICAgIHRoaXMuc3RvcFRpbWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhcnRUaW1lICs9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMucGF1c2VTdGFydCk7XG4gICAgICB0aGlzLmVuZFRpbWUgKz0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5wYXVzZVN0YXJ0KTtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KHRoaXMuaW5zdGFuY2UsIHRoaXMuc2xlZXBUaW1lKSk7XG4gICAgfVxuICB9XG5cbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuaXRlbS5jbGljayEuZW1pdChldmVudCk7XG5cbiAgICBpZiAodGhpcy5jbGlja1RvQ2xvc2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGlja0ljb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLml0ZW0uY2xpY2tJY29uIS5lbWl0KGV2ZW50KTtcblxuICAgIGlmICh0aGlzLmNsaWNrSWNvblRvQ2xvc2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQXR0YWNoIGFsbCB0aGUgb3ZlcnJpZGVzXG4gIGF0dGFjaE92ZXJyaWRlcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLml0ZW0ub3ZlcnJpZGUpLmZvckVhY2goYSA9PiB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW2FdID0gdGhpcy5pdGVtLm92ZXJyaWRlW2FdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnN0YW5jZSA9ICgpID0+IHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmICh0aGlzLmVuZFRpbWUgPCBub3cpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICB0aGlzLml0ZW0udGltZW91dEVuZCEuZW1pdCgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RvcFRpbWUpIHtcbiAgICAgIGlmICh0aGlzLnNob3dQcm9ncmVzc0Jhcikge1xuICAgICAgICAvLyBXZSBhZGQgdGhpcy5zbGVlcFRpbWUganVzdCB0byBoYXZlIDEwMCUgYmVmb3JlIGNsb3NlXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NXaWR0aCA9IE1hdGgubWluKChub3cgLSB0aGlzLnN0YXJ0VGltZSArIHRoaXMuc2xlZXBUaW1lKSAqIDEwMCAvIHRoaXMudGltZU91dCwgMTAwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQodGhpcy5pbnN0YW5jZSwgdGhpcy5zbGVlcFRpbWUpO1xuICAgIH1cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmICghKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgdGhpcy5pdGVtLnN0YXRlID0gdGhpcy5hbmltYXRlICsgJ091dCc7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLnNldCh0aGlzLml0ZW0sIGZhbHNlKTtcbiAgICAgIH0sIDMxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uuc2V0KHRoaXMuaXRlbSwgZmFsc2UpO1xuICAgICAgfSwgNTMxMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb250ZW50VHlwZShpdGVtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgdGhpc1trZXldID0gaXRlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1trZXldID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoaXRlbSk7XG4gICAgfVxuXG4gICAgdGhpc1trZXkgKyAnSXNUZW1wbGF0ZSddID0gaXRlbSBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmO1xuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwic2ltcGxlLW5vdGlmaWNhdGlvblwiXG4gICAgIFtAZW50ZXJMZWF2ZV09XCJpdGVtLnN0YXRlXCJcbiAgICAgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgIFtjbGFzc109XCJ0aGVDbGFzc1wiXG4gICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICdhbGVydCc6IGl0ZW0udHlwZSA9PT0gJ2FsZXJ0JyxcbiAgICAgICAgICAgICdlcnJvcic6IGl0ZW0udHlwZSA9PT0gJ2Vycm9yJyxcbiAgICAgICAgICAgICd3YXJuJzogaXRlbS50eXBlID09PSAnd2FybicsXG4gICAgICAgICAgICAnc3VjY2Vzcyc6IGl0ZW0udHlwZSA9PT0gJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgJ2luZm8nOiBpdGVtLnR5cGUgPT09ICdpbmZvJyxcbiAgICAgICAgICAgICdiYXJlJzogaXRlbS50eXBlID09PSAnYmFyZScsXG4gICAgICAgICAgICAncnRsLW1vZGUnOiBydGwsXG4gICAgICAgICAgICAnaGFzLWljb24nOiBpdGVtLmljb24gIT09ICdiYXJlJ1xuICAgICAgICB9XCJcbiAgICAgKG1vdXNlZW50ZXIpPVwib25FbnRlcigpXCJcbiAgICAgKG1vdXNlbGVhdmUpPVwib25MZWF2ZSgpXCI+XG5cbiAgICA8ZGl2ICpuZ0lmPVwiIWl0ZW0uaHRtbFwiPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzbi10aXRsZVwiICpuZ0lmPVwidGl0bGVJc1RlbXBsYXRlOyBlbHNlIHJlZ3VsYXJUaXRsZVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRpdGxlOyBjb250ZXh0OiBpdGVtLmNvbnRleHRcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNyZWd1bGFyVGl0bGU+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic24tdGl0bGVcIiBbaW5uZXJIVE1MXT1cInRpdGxlXCI+PC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNuLWNvbnRlbnRcIiAqbmdJZj1cImNvbnRlbnRJc1RlbXBsYXRlIGVsc2UgcmVndWxhckNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50OyBjb250ZXh0OiBpdGVtLmNvbnRleHRcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNyZWd1bGFyQ29udGVudD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzbi1jb250ZW50XCIgW2lubmVySFRNTF09XCJjb250ZW50XCI+PC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIiAqbmdJZj1cIml0ZW0uaWNvbiAhPT0gJ2JhcmUnXCIgW2lubmVySFRNTF09XCJzYWZlU3ZnXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiAqbmdJZj1cIml0ZW0uaHRtbFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic24taHRtbFwiICpuZ0lmPVwiaHRtbElzVGVtcGxhdGU7IGVsc2UgcmVndWxhckh0bWxcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtLmh0bWw7IGNvbnRleHQ6IGl0ZW0uY29udGV4dFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8bmctdGVtcGxhdGUgI3JlZ3VsYXJIdG1sPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNuLWNvbnRlbnRcIiBbaW5uZXJIVE1MXT1cInNhZmVJbnB1dEh0bWxcIj48L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvblwiIFtjbGFzcy5pY29uLWhvdmVyXT1cImNsaWNrSWNvblRvQ2xvc2VcIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtpbm5lckhUTUxdPVwic2FmZVN2Z1wiIChjbGljayk9XCJvbkNsaWNrSWNvbigkZXZlbnQpXCI+PC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwic24tcHJvZ3Jlc3MtbG9hZGVyXCIgKm5nSWY9XCJzaG93UHJvZ3Jlc3NCYXJcIj5cbiAgICAgICAgPHNwYW4gW25nU3R5bGVdPVwieyd3aWR0aCc6IHByb2dyZXNzV2lkdGggKyAnJSd9XCI+PC9zcGFuPlxuICAgIDwvZGl2PlxuXG48L2Rpdj5cbiJdfQ==