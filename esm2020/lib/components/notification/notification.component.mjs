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
NotificationComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NotificationComponent, deps: [{ token: i1.NotificationsService }, { token: i2.DomSanitizer }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
NotificationComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: NotificationComponent, selector: "simple-notification", inputs: { timeOut: "timeOut", showProgressBar: "showProgressBar", pauseOnHover: "pauseOnHover", clickToClose: "clickToClose", clickIconToClose: "clickIconToClose", maxLength: "maxLength", theClass: "theClass", rtl: "rtl", animate: "animate", position: "position", item: "item" }, ngImport: i0, template: "<div class=\"simple-notification\"\n     [@enterLeave]=\"item.state\"\n     (click)=\"onClick($event)\"\n     [class]=\"theClass\"\n     [ngClass]=\"{\n            'alert': item.type === 'alert',\n            'error': item.type === 'error',\n            'warn': item.type === 'warn',\n            'success': item.type === 'success',\n            'info': item.type === 'info',\n            'bare': item.type === 'bare',\n            'rtl-mode': rtl,\n            'has-icon': item.icon !== 'bare'\n        }\"\n     (mouseenter)=\"onEnter()\"\n     (mouseleave)=\"onLeave()\">\n\n    <div *ngIf=\"!item.html\">\n\n        <div class=\"sn-title\" *ngIf=\"titleIsTemplate; else regularTitle\">\n            <ng-container *ngTemplateOutlet=\"title; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularTitle>\n            <div class=\"sn-title\" [innerHTML]=\"title\"></div>\n        </ng-template>\n\n        <div class=\"sn-content\" *ngIf=\"contentIsTemplate else regularContent\">\n            <ng-container *ngTemplateOutlet=\"content; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularContent>\n            <div class=\"sn-content\" [innerHTML]=\"content\"></div>\n        </ng-template>\n\n        <div class=\"icon\" *ngIf=\"item.icon !== 'bare'\" [innerHTML]=\"safeSvg\"></div>\n    </div>\n    <div *ngIf=\"item.html\">\n        <div class=\"sn-html\" *ngIf=\"htmlIsTemplate; else regularHtml\">\n            <ng-container *ngTemplateOutlet=\"item.html; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularHtml>\n            <div class=\"sn-content\" [innerHTML]=\"safeInputHtml\"></div>\n        </ng-template>\n\n        <div class=\"icon\" [class.icon-hover]=\"clickIconToClose\" *ngIf=\"item.icon\" [innerHTML]=\"safeSvg\" (click)=\"onClickIcon($event)\"></div>\n    </div>\n\n    <div class=\"sn-progress-loader\" *ngIf=\"showProgressBar\">\n        <span [ngStyle]=\"{'width': progressWidth + '%'}\"></span>\n    </div>\n\n</div>\n", styles: [".simple-notification{position:fixed;padding:10px 20px;display:flex;align-items:center;width:520px;min-height:56px;left:50%;bottom:-400px;transform:translate(-50%);box-sizing:border-box;border-top-left-radius:6px;border-top-right-radius:6px;color:#fff;cursor:pointer;transition:all .5s;background:#434f54}.simple-notification .sn-title,.simple-notification .sn-content,.simple-notification .sn-html{margin:0}.simple-notification .sn-title{max-width:314px;font-size:16px;font-style:normal;line-height:1.33;letter-spacing:normal;color:#fff}.simple-notification .sn-content{font-size:16px;line-height:1.33;color:#fff}.simple-notification.has-icon .sn-title,.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html{padding:0 50px 0 0}.simple-notification .icon{position:absolute;width:50px;height:50px;top:55%;right:0;transform:translateY(-50%);box-sizing:border-box}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-title,.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%}.simple-notification .sn-progress-loader span{border-radius:6px;background:#00a8ea}\n"], directives: [{ type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i3.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }, { type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
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
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: NotificationComponent, decorators: [{
            type: Component,
            args: [{ selector: 'simple-notification', encapsulation: ViewEncapsulation.None, animations: [
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
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"simple-notification\"\n     [@enterLeave]=\"item.state\"\n     (click)=\"onClick($event)\"\n     [class]=\"theClass\"\n     [ngClass]=\"{\n            'alert': item.type === 'alert',\n            'error': item.type === 'error',\n            'warn': item.type === 'warn',\n            'success': item.type === 'success',\n            'info': item.type === 'info',\n            'bare': item.type === 'bare',\n            'rtl-mode': rtl,\n            'has-icon': item.icon !== 'bare'\n        }\"\n     (mouseenter)=\"onEnter()\"\n     (mouseleave)=\"onLeave()\">\n\n    <div *ngIf=\"!item.html\">\n\n        <div class=\"sn-title\" *ngIf=\"titleIsTemplate; else regularTitle\">\n            <ng-container *ngTemplateOutlet=\"title; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularTitle>\n            <div class=\"sn-title\" [innerHTML]=\"title\"></div>\n        </ng-template>\n\n        <div class=\"sn-content\" *ngIf=\"contentIsTemplate else regularContent\">\n            <ng-container *ngTemplateOutlet=\"content; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularContent>\n            <div class=\"sn-content\" [innerHTML]=\"content\"></div>\n        </ng-template>\n\n        <div class=\"icon\" *ngIf=\"item.icon !== 'bare'\" [innerHTML]=\"safeSvg\"></div>\n    </div>\n    <div *ngIf=\"item.html\">\n        <div class=\"sn-html\" *ngIf=\"htmlIsTemplate; else regularHtml\">\n            <ng-container *ngTemplateOutlet=\"item.html; context: item.context\"></ng-container>\n        </div>\n\n        <ng-template #regularHtml>\n            <div class=\"sn-content\" [innerHTML]=\"safeInputHtml\"></div>\n        </ng-template>\n\n        <div class=\"icon\" [class.icon-hover]=\"clickIconToClose\" *ngIf=\"item.icon\" [innerHTML]=\"safeSvg\" (click)=\"onClickIcon($event)\"></div>\n    </div>\n\n    <div class=\"sn-progress-loader\" *ngIf=\"showProgressBar\">\n        <span [ngStyle]=\"{'width': progressWidth + '%'}\"></span>\n    </div>\n\n</div>\n", styles: [".simple-notification{position:fixed;padding:10px 20px;display:flex;align-items:center;width:520px;min-height:56px;left:50%;bottom:-400px;transform:translate(-50%);box-sizing:border-box;border-top-left-radius:6px;border-top-right-radius:6px;color:#fff;cursor:pointer;transition:all .5s;background:#434f54}.simple-notification .sn-title,.simple-notification .sn-content,.simple-notification .sn-html{margin:0}.simple-notification .sn-title{max-width:314px;font-size:16px;font-style:normal;line-height:1.33;letter-spacing:normal;color:#fff}.simple-notification .sn-content{font-size:16px;line-height:1.33;color:#fff}.simple-notification.has-icon .sn-title,.simple-notification.has-icon .sn-content,.simple-notification.has-icon .sn-html{padding:0 50px 0 0}.simple-notification .icon{position:absolute;width:50px;height:50px;top:55%;right:0;transform:translateY(-50%);box-sizing:border-box}.simple-notification .icon.icon-hover:hover{opacity:.5}.simple-notification .icon svg{fill:#fff;width:100%;height:100%}.simple-notification .icon svg g{fill:#fff}.simple-notification.rtl-mode.has-icon .sn-title,.simple-notification.rtl-mode.has-icon .sn-content,.simple-notification.rtl-mode.has-icon .sn-html{padding:0 0 0 50px}.simple-notification.rtl-mode{direction:rtl}.simple-notification.rtl-mode .sn-content{padding:0 0 0 50px}.simple-notification.rtl-mode svg{left:0;right:auto}.simple-notification .sn-progress-loader{position:absolute;top:0;left:0;width:100%;height:5px}.simple-notification .sn-progress-loader span{float:left;height:100%}.simple-notification .sn-progress-loader span{border-radius:6px;background:#00a8ea}\n"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDakYsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQTZCLFdBQVcsRUFBRSxpQkFBaUIsRUFBOEIsTUFBTSxlQUFlLENBQUM7Ozs7O0FBc0dqSyxNQUFNLE9BQU8scUJBQXFCO0lBcUNoQyxZQUNVLG1CQUF5QyxFQUN6QyxZQUEwQixFQUMxQixFQUFxQixFQUNyQixJQUFZO1FBSFosd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFzQjtRQUN6QyxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBdEJ0QixvQkFBZSxHQUFHLEtBQUssQ0FBQztRQUN4QixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFFdkIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFJVixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBRWpCLG9CQUFlLEdBQUcsRUFBRSxDQUFDO1FBeUZyQixhQUFRLEdBQUcsR0FBRyxFQUFFO1lBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFakMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQzlCO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN6QixJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7b0JBQ3hCLHVEQUF1RDtvQkFDdkQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUNsRztnQkFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUN4RDtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBSSxDQUFFLElBQUksQ0FBQyxFQUFjLENBQUMsU0FBUyxFQUFFO29CQUNuQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN6QjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFBO0lBL0ZFLENBQUM7SUFFSixRQUFRO1FBQ04sSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUNoQztRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRixDQUFDO0lBRUQsV0FBVztRQUNULFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO1FBQ3RELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzNELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQzlFO0lBQ0gsQ0FBQztJQUVELE9BQU8sQ0FBQyxLQUFpQjtRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0IsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFpQjtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFakMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQsMkJBQTJCO0lBQzNCLGVBQWU7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzFDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDekIsSUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBdUJPLE1BQU07UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDdkMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDZCxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDakQsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7YUFBTTtZQUNMLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ2pELENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQztJQUVPLFdBQVcsQ0FBQyxJQUFTLEVBQUUsR0FBVztRQUN4QyxJQUFJLElBQUksWUFBWSxXQUFXLEVBQUU7WUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUNsQjthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxJQUFJLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxHQUFHLElBQUksWUFBWSxXQUFXLENBQUM7SUFDekQsQ0FBQzs7bUhBaEtVLHFCQUFxQjt1R0FBckIscUJBQXFCLG1WQ3ZHbEMscWdFQXNEQSxvOURENUNjO1FBQ1YsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUVwQixPQUFPO1lBQ1AsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1lBQ25ELFVBQVUsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3RCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQztnQkFDbkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDO2FBQzlCLENBQUM7WUFDRixLQUFLLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDdkQsVUFBVSxDQUFDLGlCQUFpQixFQUFFO2dCQUM1QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUM7Z0JBQ25CLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQzthQUM5QixDQUFDO1lBRUYsaUJBQWlCO1lBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQztZQUNqRSxVQUFVLENBQUMsY0FBYyxFQUFFO2dCQUN6QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO2dCQUNqRCxPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDN0IsQ0FBQztZQUNGLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO1lBQ3JFLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDbEMsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUM7Z0JBQy9DLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUM3QixDQUFDO1lBRUYsbUJBQW1CO1lBQ25CLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQztZQUNuRSxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQzNCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFDLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUM3QixDQUFDO1lBQ0YsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxDQUFDLENBQUM7WUFDeEUsVUFBVSxDQUFDLDJCQUEyQixFQUFFO2dCQUN0QyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQztnQkFDL0MsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzdCLENBQUM7WUFFRixvQkFBb0I7WUFDcEIsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO1lBQ3BFLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtnQkFDNUIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztnQkFDaEQsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzdCLENBQUM7WUFDRixLQUFLLENBQUMsZUFBZSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLENBQUMsQ0FBQztZQUN6RSxVQUFVLENBQUMsNkJBQTZCLEVBQUU7Z0JBQ3hDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDO2dCQUMvQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDN0IsQ0FBQztZQUVGLGtCQUFrQjtZQUNsQixLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7WUFDbEUsVUFBVSxDQUFDLGVBQWUsRUFBRTtnQkFDMUIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztnQkFDakQsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzdCLENBQUM7WUFDRixLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztZQUN0RSxVQUFVLENBQUMseUJBQXlCLEVBQUU7Z0JBQ3BDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDO2dCQUMvQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7YUFDN0IsQ0FBQztZQUVGLFNBQVM7WUFDVCxLQUFLLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7WUFDMUQsVUFBVSxDQUFDLFlBQVksRUFBRTtnQkFDdkIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUM3QixDQUFDO1lBQ0YsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1lBQzdELFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDOUIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUM7Z0JBQzFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzthQUM3QixDQUFDO1lBRUYsUUFBUTtZQUNSLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFDLENBQUMsQ0FBQztZQUMvRCxVQUFVLENBQUMsYUFBYSxFQUFFO2dCQUN4QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzdCLENBQUM7WUFDRixLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7WUFDbkUsVUFBVSxDQUFDLHFCQUFxQixFQUFFO2dCQUNoQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQztnQkFDOUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO2FBQzdCLENBQUM7U0FDSCxDQUFDO0tBQ0g7NEZBTVUscUJBQXFCO2tCQWhHakMsU0FBUzsrQkFDRSxxQkFBcUIsaUJBQ2hCLGlCQUFpQixDQUFDLElBQUksY0FDekI7d0JBQ1YsT0FBTyxDQUFDLFlBQVksRUFBRTs0QkFFcEIsT0FBTzs0QkFDUCxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7NEJBQ25ELFVBQVUsQ0FBQyxXQUFXLEVBQUU7Z0NBQ3RCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQztnQ0FDbkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDOzZCQUM5QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQzs0QkFDdkQsVUFBVSxDQUFDLGlCQUFpQixFQUFFO2dDQUM1QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUM7Z0NBQ25CLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQzs2QkFDOUIsQ0FBQzs0QkFFRixpQkFBaUI7NEJBQ2pCLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQzs0QkFDakUsVUFBVSxDQUFDLGNBQWMsRUFBRTtnQ0FDekIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQztnQ0FDakQsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDOzRCQUNyRSxVQUFVLENBQUMsdUJBQXVCLEVBQUU7Z0NBQ2xDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDO2dDQUMvQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7NkJBQzdCLENBQUM7NEJBRUYsbUJBQW1COzRCQUNuQixLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7NEJBQ25FLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtnQ0FDM0IsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztnQ0FDaEQsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDOzRCQUN4RSxVQUFVLENBQUMsMkJBQTJCLEVBQUU7Z0NBQ3RDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDO2dDQUMvQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7NkJBQzdCLENBQUM7NEJBRUYsb0JBQW9COzRCQUNwQixLQUFLLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7NEJBQ3BFLFVBQVUsQ0FBQyxpQkFBaUIsRUFBRTtnQ0FDNUIsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQztnQ0FDaEQsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDOzRCQUN6RSxVQUFVLENBQUMsNkJBQTZCLEVBQUU7Z0NBQ3hDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDO2dDQUMvQyxPQUFPLENBQUMsbUJBQW1CLENBQUM7NkJBQzdCLENBQUM7NEJBRUYsa0JBQWtCOzRCQUNsQixLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7NEJBQ2xFLFVBQVUsQ0FBQyxlQUFlLEVBQUU7Z0NBQzFCLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLENBQUM7Z0NBQ2pELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQzs2QkFDN0IsQ0FBQzs0QkFDRixLQUFLLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQzs0QkFDdEUsVUFBVSxDQUFDLHlCQUF5QixFQUFFO2dDQUNwQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQztnQ0FDL0MsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUVGLFNBQVM7NEJBQ1QsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDOzRCQUMxRCxVQUFVLENBQUMsWUFBWSxFQUFFO2dDQUN2QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQztnQ0FDMUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQzs0QkFDN0QsVUFBVSxDQUFDLG1CQUFtQixFQUFFO2dDQUM5QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsQ0FBQztnQ0FDMUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUVGLFFBQVE7NEJBQ1IsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDOzRCQUMvRCxVQUFVLENBQUMsYUFBYSxFQUFFO2dDQUN4QixLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQztnQ0FDOUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDOzRCQUNGLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQzs0QkFDbkUsVUFBVSxDQUFDLHFCQUFxQixFQUFFO2dDQUNoQyxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQztnQ0FDOUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDOzZCQUM3QixDQUFDO3lCQUNILENBQUM7cUJBQ0gsbUJBR2dCLHVCQUF1QixDQUFDLE1BQU07MkxBS3RDLE9BQU87c0JBQWYsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEdBQUc7c0JBQVgsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhbmltYXRlLCBzdGF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBOZ1pvbmUsIE9uRGVzdHJveSwgT25Jbml0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmLCBWaWV3UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlIH0gZnJvbSAnLi4vLi4vZW51bXMvbm90aWZpY2F0aW9uLWFuaW1hdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub3RpZmljYXRpb24udHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NpbXBsZS1ub3RpZmljYXRpb24nLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignZW50ZXJMZWF2ZScsIFtcblxuICAgICAgLy8gRmFkZVxuICAgICAgc3RhdGUoJ2ZhZGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgYm90dG9tOiAnLTIwcHgnfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmYWRlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICAgICBhbmltYXRlKCcxMDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZmFkZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCBib3R0b206ICctNDAwcHgnfSkpLFxuICAgICAgdHJhbnNpdGlvbignZmFkZSA9PiBmYWRlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMX0pLFxuICAgICAgICBhbmltYXRlKCcxMDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gdG9wXG4gICAgICBzdGF0ZSgnZnJvbVRvcCcsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbVRvcCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbVRvcE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tVG9wID0+IGZyb21Ub3BPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSByaWdodFxuICAgICAgc3RhdGUoJ2Zyb21SaWdodCcsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbVJpZ2h0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg1JSknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ2Zyb21SaWdodE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbVJpZ2h0ID0+IGZyb21SaWdodE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBFbnRlciBmcm9tIGJvdHRvbVxuICAgICAgc3RhdGUoJ2Zyb21Cb3R0b20nLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZyb21Cb3R0b20nLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbUJvdHRvbU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC01JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbUJvdHRvbSA9PiBmcm9tQm90dG9tT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnMzAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gbGVmdFxuICAgICAgc3RhdGUoJ2Zyb21MZWZ0Jywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tTGVmdCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbUxlZnRPdXQnLCBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCg1JSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignZnJvbUxlZnQgPT4gZnJvbUxlZnRPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gUm90YXRlXG4gICAgICBzdGF0ZSgnc2NhbGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMSknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBzY2FsZScsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdzY2FsZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdzY2FsZSgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdzY2FsZSA9PiBzY2FsZU91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3NjYWxlKDEpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gU2NhbGVcbiAgICAgIHN0YXRlKCdyb3RhdGUnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gcm90YXRlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAncm90YXRlKDVkZWcpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdyb3RhdGVPdXQnLCBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAncm90YXRlKC01ZGVnKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdyb3RhdGUgPT4gcm90YXRlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKVxuICAgIF0pXG4gIF0sXG4gIHRlbXBsYXRlVXJsOiAnLi9ub3RpZmljYXRpb24uY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9ub3RpZmljYXRpb24uY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcblxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcblxuICBASW5wdXQoKSB0aW1lT3V0OiBudW1iZXI7XG4gIEBJbnB1dCgpIHNob3dQcm9ncmVzc0JhcjogYm9vbGVhbjtcbiAgQElucHV0KCkgcGF1c2VPbkhvdmVyOiBib29sZWFuO1xuICBASW5wdXQoKSBjbGlja1RvQ2xvc2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsaWNrSWNvblRvQ2xvc2U6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1heExlbmd0aDogbnVtYmVyO1xuICBASW5wdXQoKSB0aGVDbGFzczogc3RyaW5nO1xuICBASW5wdXQoKSBydGw6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGFuaW1hdGU6IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGU7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBudW1iZXI7XG4gIEBJbnB1dCgpIGl0ZW06IE5vdGlmaWNhdGlvbjtcblxuXG4gIC8vIFByb2dyZXNzIGJhciB2YXJpYWJsZXNcbiAgdGl0bGU6IGFueTtcbiAgY29udGVudDogYW55O1xuXG4gIHRpdGxlSXNUZW1wbGF0ZSA9IGZhbHNlO1xuICBjb250ZW50SXNUZW1wbGF0ZSA9IGZhbHNlO1xuICBodG1sSXNUZW1wbGF0ZSA9IGZhbHNlO1xuXG4gIHByb2dyZXNzV2lkdGggPSAwO1xuICBzYWZlU3ZnOiBTYWZlSHRtbDtcbiAgc2FmZUlucHV0SHRtbDogU2FmZUh0bWw7XG5cbiAgcHJpdmF0ZSBzdG9wVGltZSA9IGZhbHNlO1xuICBwcml2YXRlIHRpbWVyOiBhbnk7XG4gIHByaXZhdGUgZnJhbWVzUGVyU2Vjb25kID0gNDA7XG4gIHByaXZhdGUgc2xlZXBUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgc3RhcnRUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgZW5kVGltZTogbnVtYmVyO1xuICBwcml2YXRlIHBhdXNlU3RhcnQ6IG51bWJlcjtcblxuICBwcml2YXRlIGljb246IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5vdGlmaWNhdGlvblNlcnZpY2U6IE5vdGlmaWNhdGlvbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgZG9tU2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLml0ZW0ub3ZlcnJpZGUpIHtcbiAgICAgIHRoaXMuYXR0YWNoT3ZlcnJpZGVzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgdGhpcy5pdGVtLnN0YXRlID0gdGhpcy5hbmltYXRlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnRpbWVPdXQgIT09IDApIHtcbiAgICAgIHRoaXMuc3RhcnRUaW1lT3V0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0udGl0bGUsICd0aXRsZScpO1xuICAgIHRoaXMuY29udGVudFR5cGUodGhpcy5pdGVtLmNvbnRlbnQsICdjb250ZW50Jyk7XG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0uaHRtbCwgJ2h0bWwnKTtcblxuICAgIHRoaXMuc2FmZVN2ZyA9IHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKHRoaXMuaWNvbiB8fCB0aGlzLml0ZW0uaWNvbik7XG4gICAgdGhpcy5zYWZlSW5wdXRIdG1sID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5pdGVtLmh0bWwpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgIHRoaXMuY2QuZGV0YWNoKCk7XG4gIH1cblxuICBzdGFydFRpbWVPdXQoKTogdm9pZCB7XG4gICAgdGhpcy5zbGVlcFRpbWUgPSAxMDAwIC8gdGhpcy5mcmFtZXNQZXJTZWNvbmQgLyogbXMgKi87XG4gICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmVuZFRpbWUgPSB0aGlzLnN0YXJ0VGltZSArIHRoaXMudGltZU91dDtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gdGhpcy50aW1lciA9IHNldFRpbWVvdXQodGhpcy5pbnN0YW5jZSwgdGhpcy5zbGVlcFRpbWUpKTtcbiAgfVxuXG4gIG9uRW50ZXIoKSB7XG4gICAgaWYgKHRoaXMucGF1c2VPbkhvdmVyKSB7XG4gICAgICB0aGlzLnN0b3BUaW1lID0gdHJ1ZTtcbiAgICAgIHRoaXMucGF1c2VTdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMucGF1c2VPbkhvdmVyKSB7XG4gICAgICB0aGlzLnN0b3BUaW1lID0gZmFsc2U7XG4gICAgICB0aGlzLnN0YXJ0VGltZSArPSAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSB0aGlzLnBhdXNlU3RhcnQpO1xuICAgICAgdGhpcy5lbmRUaW1lICs9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMucGF1c2VTdGFydCk7XG4gICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4gc2V0VGltZW91dCh0aGlzLmluc3RhbmNlLCB0aGlzLnNsZWVwVGltZSkpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLml0ZW0uY2xpY2shLmVtaXQoZXZlbnQpO1xuXG4gICAgaWYgKHRoaXMuY2xpY2tUb0Nsb3NlKSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2xpY2tJY29uKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgdGhpcy5pdGVtLmNsaWNrSWNvbiEuZW1pdChldmVudCk7XG5cbiAgICBpZiAodGhpcy5jbGlja0ljb25Ub0Nsb3NlKSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEF0dGFjaCBhbGwgdGhlIG92ZXJyaWRlc1xuICBhdHRhY2hPdmVycmlkZXMoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pdGVtLm92ZXJyaWRlKS5mb3JFYWNoKGEgPT4ge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoYSkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVthXSA9IHRoaXMuaXRlbS5vdmVycmlkZVthXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgaW5zdGFuY2UgPSAoKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodGhpcy5lbmRUaW1lIDwgbm93KSB7XG4gICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgdGhpcy5pdGVtLnRpbWVvdXRFbmQhLmVtaXQoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0b3BUaW1lKSB7XG4gICAgICBpZiAodGhpcy5zaG93UHJvZ3Jlc3NCYXIpIHtcbiAgICAgICAgLy8gV2UgYWRkIHRoaXMuc2xlZXBUaW1lIGp1c3QgdG8gaGF2ZSAxMDAlIGJlZm9yZSBjbG9zZVxuICAgICAgICB0aGlzLnByb2dyZXNzV2lkdGggPSBNYXRoLm1pbigobm93IC0gdGhpcy5zdGFydFRpbWUgKyB0aGlzLnNsZWVwVGltZSkgKiAxMDAgLyB0aGlzLnRpbWVPdXQsIDEwMCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuaW5zdGFuY2UsIHRoaXMuc2xlZXBUaW1lKTtcbiAgICB9XG4gICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICBpZiAoISh0aGlzLmNkIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgIHRoaXMuaXRlbS5zdGF0ZSA9IHRoaXMuYW5pbWF0ZSArICdPdXQnO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uU2VydmljZS5zZXQodGhpcy5pdGVtLCBmYWxzZSk7XG4gICAgICB9LCAzMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLnNldCh0aGlzLml0ZW0sIGZhbHNlKTtcbiAgICAgIH0sIDUzMTApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29udGVudFR5cGUoaXRlbTogYW55LCBrZXk6IHN0cmluZykge1xuICAgIGlmIChpdGVtIGluc3RhbmNlb2YgVGVtcGxhdGVSZWYpIHtcbiAgICAgIHRoaXNba2V5XSA9IGl0ZW07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXNba2V5XSA9IHRoaXMuZG9tU2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKGl0ZW0pO1xuICAgIH1cblxuICAgIHRoaXNba2V5ICsgJ0lzVGVtcGxhdGUnXSA9IGl0ZW0gaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZjtcbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInNpbXBsZS1ub3RpZmljYXRpb25cIlxuICAgICBbQGVudGVyTGVhdmVdPVwiaXRlbS5zdGF0ZVwiXG4gICAgIChjbGljayk9XCJvbkNsaWNrKCRldmVudClcIlxuICAgICBbY2xhc3NdPVwidGhlQ2xhc3NcIlxuICAgICBbbmdDbGFzc109XCJ7XG4gICAgICAgICAgICAnYWxlcnQnOiBpdGVtLnR5cGUgPT09ICdhbGVydCcsXG4gICAgICAgICAgICAnZXJyb3InOiBpdGVtLnR5cGUgPT09ICdlcnJvcicsXG4gICAgICAgICAgICAnd2Fybic6IGl0ZW0udHlwZSA9PT0gJ3dhcm4nLFxuICAgICAgICAgICAgJ3N1Y2Nlc3MnOiBpdGVtLnR5cGUgPT09ICdzdWNjZXNzJyxcbiAgICAgICAgICAgICdpbmZvJzogaXRlbS50eXBlID09PSAnaW5mbycsXG4gICAgICAgICAgICAnYmFyZSc6IGl0ZW0udHlwZSA9PT0gJ2JhcmUnLFxuICAgICAgICAgICAgJ3J0bC1tb2RlJzogcnRsLFxuICAgICAgICAgICAgJ2hhcy1pY29uJzogaXRlbS5pY29uICE9PSAnYmFyZSdcbiAgICAgICAgfVwiXG4gICAgIChtb3VzZWVudGVyKT1cIm9uRW50ZXIoKVwiXG4gICAgIChtb3VzZWxlYXZlKT1cIm9uTGVhdmUoKVwiPlxuXG4gICAgPGRpdiAqbmdJZj1cIiFpdGVtLmh0bWxcIj5cblxuICAgICAgICA8ZGl2IGNsYXNzPVwic24tdGl0bGVcIiAqbmdJZj1cInRpdGxlSXNUZW1wbGF0ZTsgZWxzZSByZWd1bGFyVGl0bGVcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0aXRsZTsgY29udGV4dDogaXRlbS5jb250ZXh0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcmVndWxhclRpdGxlPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNuLXRpdGxlXCIgW2lubmVySFRNTF09XCJ0aXRsZVwiPjwvZGl2PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzbi1jb250ZW50XCIgKm5nSWY9XCJjb250ZW50SXNUZW1wbGF0ZSBlbHNlIHJlZ3VsYXJDb250ZW50XCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudDsgY29udGV4dDogaXRlbS5jb250ZXh0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxuZy10ZW1wbGF0ZSAjcmVndWxhckNvbnRlbnQ+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic24tY29udGVudFwiIFtpbm5lckhUTUxdPVwiY29udGVudFwiPjwvZGl2PlxuICAgICAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJpY29uXCIgKm5nSWY9XCJpdGVtLmljb24gIT09ICdiYXJlJ1wiIFtpbm5lckhUTUxdPVwic2FmZVN2Z1wiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgKm5nSWY9XCJpdGVtLmh0bWxcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNuLWh0bWxcIiAqbmdJZj1cImh0bWxJc1RlbXBsYXRlOyBlbHNlIHJlZ3VsYXJIdG1sXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS5odG1sOyBjb250ZXh0OiBpdGVtLmNvbnRleHRcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPG5nLXRlbXBsYXRlICNyZWd1bGFySHRtbD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzbi1jb250ZW50XCIgW2lubmVySFRNTF09XCJzYWZlSW5wdXRIdG1sXCI+PC9kaXY+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICAgICAgPGRpdiBjbGFzcz1cImljb25cIiBbY2xhc3MuaWNvbi1ob3Zlcl09XCJjbGlja0ljb25Ub0Nsb3NlXCIgKm5nSWY9XCJpdGVtLmljb25cIiBbaW5uZXJIVE1MXT1cInNhZmVTdmdcIiAoY2xpY2spPVwib25DbGlja0ljb24oJGV2ZW50KVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cInNuLXByb2dyZXNzLWxvYWRlclwiICpuZ0lmPVwic2hvd1Byb2dyZXNzQmFyXCI+XG4gICAgICAgIDxzcGFuIFtuZ1N0eWxlXT1cInsnd2lkdGgnOiBwcm9ncmVzc1dpZHRoICsgJyUnfVwiPjwvc3Bhbj5cbiAgICA8L2Rpdj5cblxuPC9kaXY+XG4iXX0=