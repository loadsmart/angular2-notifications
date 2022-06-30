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
var NotificationComponent = /** @class */ (function () {
    function NotificationComponent(notificationService, domSanitizer, cd, zone) {
        var _this = this;
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
        this.instance = function () {
            var now = new Date().getTime();
            if (_this.endTime < now) {
                _this.remove();
                _this.item.timeoutEnd.emit();
            }
            else if (!_this.stopTime) {
                if (_this.showProgressBar) {
                    // We add this.sleepTime just to have 100% before close
                    _this.progressWidth = Math.min((now - _this.startTime + _this.sleepTime) * 100 / _this.timeOut, 100);
                }
                _this.timer = setTimeout(_this.instance, _this.sleepTime);
            }
            _this.zone.run(function () {
                if (!_this.cd.destroyed) {
                    _this.cd.detectChanges();
                }
            });
        };
    }
    NotificationComponent.prototype.ngOnInit = function () {
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
    };
    NotificationComponent.prototype.ngOnDestroy = function () {
        clearTimeout(this.timer);
        this.cd.detach();
    };
    NotificationComponent.prototype.startTimeOut = function () {
        var _this = this;
        this.sleepTime = 1000 / this.framesPerSecond /* ms */;
        this.startTime = new Date().getTime();
        this.endTime = this.startTime + this.timeOut;
        this.zone.runOutsideAngular(function () { return _this.timer = setTimeout(_this.instance, _this.sleepTime); });
    };
    NotificationComponent.prototype.onEnter = function () {
        if (this.pauseOnHover) {
            this.stopTime = true;
            this.pauseStart = new Date().getTime();
        }
    };
    NotificationComponent.prototype.onLeave = function () {
        var _this = this;
        if (this.pauseOnHover) {
            this.stopTime = false;
            this.startTime += (new Date().getTime() - this.pauseStart);
            this.endTime += (new Date().getTime() - this.pauseStart);
            this.zone.runOutsideAngular(function () { return setTimeout(_this.instance, _this.sleepTime); });
        }
    };
    NotificationComponent.prototype.onClick = function (event) {
        this.item.click.emit(event);
        if (this.clickToClose) {
            this.remove();
        }
    };
    NotificationComponent.prototype.onClickIcon = function (event) {
        this.item.clickIcon.emit(event);
        if (this.clickIconToClose) {
            this.remove();
        }
    };
    // Attach all the overrides
    NotificationComponent.prototype.attachOverrides = function () {
        var _this = this;
        Object.keys(this.item.override).forEach(function (a) {
            if (_this.hasOwnProperty(a)) {
                _this[a] = _this.item.override[a];
            }
        });
    };
    NotificationComponent.prototype.remove = function () {
        var _this = this;
        if (this.animate) {
            this.item.state = this.animate + 'Out';
            setTimeout(function () {
                _this.notificationService.set(_this.item, false);
            }, 310);
        }
        else {
            setTimeout(function () {
                _this.notificationService.set(_this.item, false);
            }, 5310);
        }
    };
    NotificationComponent.prototype.contentType = function (item, key) {
        if (item instanceof TemplateRef) {
            this[key] = item;
        }
        else {
            this[key] = this.domSanitizer.bypassSecurityTrustHtml(item);
        }
        this[key + 'IsTemplate'] = item instanceof TemplateRef;
    };
    NotificationComponent.ctorParameters = function () { return [
        { type: NotificationsService },
        { type: DomSanitizer },
        { type: ChangeDetectorRef },
        { type: NgZone }
    ]; };
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
    return NotificationComponent;
}());
export { NotificationComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLW5vdGlmaWNhdGlvbnMvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9ub3RpZmljYXRpb24vbm90aWZpY2F0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2pGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakssT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUduRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQWtHNUU7SUFxQ0UsK0JBQ1UsbUJBQXlDLEVBQ3pDLFlBQTBCLEVBQzFCLEVBQXFCLEVBQ3JCLElBQVk7UUFKdEIsaUJBS0k7UUFKTSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBQ3pDLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBQ3JCLFNBQUksR0FBSixJQUFJLENBQVE7UUF0QnRCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMxQixtQkFBYyxHQUFHLEtBQUssQ0FBQztRQUV2QixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUlWLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsb0JBQWUsR0FBRyxFQUFFLENBQUM7UUF5RnJCLGFBQVEsR0FBRztZQUNqQixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUks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RUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUMsQ0FBQyxDQUFDO29CQUNuRSxVQUFVLENBQUMscUJBQXFCLEVBQUU7d0JBQ2hDLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBQyxDQUFDO3dCQUM5QyxPQUFPLENBQUMsbUJBQW1CLENBQUM7cUJBQzdCLENBQUM7aUJBQ0gsQ0FBQzthQUNIO1lBQ0QsK2dFQUE0QztZQUU1QyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs7U0FDaEQsQ0FBQztPQUVXLHFCQUFxQixDQWlLakM7SUFBRCw0QkFBQztDQUFBLEFBaktELElBaUtDO1NBaktZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE5nWm9uZSwgT25EZXN0cm95LCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUgfSBmcm9tICcuLi8uLi9lbnVtcy9ub3RpZmljYXRpb24tYW5pbWF0aW9uLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vdGlmaWNhdGlvbi50eXBlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2ltcGxlLW5vdGlmaWNhdGlvbicsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGFuaW1hdGlvbnM6IFtcbiAgICB0cmlnZ2VyKCdlbnRlckxlYXZlJywgW1xuXG4gICAgICAvLyBGYWRlXG4gICAgICBzdGF0ZSgnZmFkZScsIHN0eWxlKHtvcGFjaXR5OiAxLCBib3R0b206ICctMjBweCd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZhZGUnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwfSksXG4gICAgICAgIGFuaW1hdGUoJzEwMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmYWRlT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIGJvdHRvbTogJy00MDBweCd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmYWRlID0+IGZhZGVPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxfSksXG4gICAgICAgIGFuaW1hdGUoJzEwMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSB0b3BcbiAgICAgIHN0YXRlKCdmcm9tVG9wJywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tVG9wJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tVG9wT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoNSUpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ2Zyb21Ub3AgPT4gZnJvbVRvcE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBFbnRlciBmcm9tIHJpZ2h0XG4gICAgICBzdGF0ZSgnZnJvbVJpZ2h0Jywgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiBmcm9tUmlnaHQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDUlKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnNDAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG4gICAgICBzdGF0ZSgnZnJvbVJpZ2h0T3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tUmlnaHQgPT4gZnJvbVJpZ2h0T3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSd9KSxcbiAgICAgICAgYW5pbWF0ZSgnMzAwbXMgZWFzZS1pbi1vdXQnKVxuICAgICAgXSksXG5cbiAgICAgIC8vIEVudGVyIGZyb20gYm90dG9tXG4gICAgICBzdGF0ZSgnZnJvbUJvdHRvbScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJyogPT4gZnJvbUJvdHRvbScsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tQm90dG9tT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoLTUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tQm90dG9tID0+IGZyb21Cb3R0b21PdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDApJ30pLFxuICAgICAgICBhbmltYXRlKCczMDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcblxuICAgICAgLy8gRW50ZXIgZnJvbSBsZWZ0XG4gICAgICBzdGF0ZSgnZnJvbUxlZnQnLCBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgwKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IGZyb21MZWZ0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNSUpJ30pLFxuICAgICAgICBhbmltYXRlKCc0MDBtcyBlYXNlLWluLW91dCcpXG4gICAgICBdKSxcbiAgICAgIHN0YXRlKCdmcm9tTGVmdE91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKDUlKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCdmcm9tTGVmdCA9PiBmcm9tTGVmdE91dCcsIFtcbiAgICAgICAgc3R5bGUoe29wYWNpdHk6IDEsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzMwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBSb3RhdGVcbiAgICAgIHN0YXRlKCdzY2FsZScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdzY2FsZSgxKSd9KSksXG4gICAgICB0cmFuc2l0aW9uKCcqID0+IHNjYWxlJywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMCwgdHJhbnNmb3JtOiAnc2NhbGUoMCknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ3NjYWxlT3V0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDApJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ3NjYWxlID0+IHNjYWxlT3V0JywgW1xuICAgICAgICBzdHlsZSh7b3BhY2l0eTogMSwgdHJhbnNmb3JtOiAnc2NhbGUoMSknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuXG4gICAgICAvLyBTY2FsZVxuICAgICAgc3RhdGUoJ3JvdGF0ZScsIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSkpLFxuICAgICAgdHJhbnNpdGlvbignKiA9PiByb3RhdGUnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdyb3RhdGUoNWRlZyknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pLFxuICAgICAgc3RhdGUoJ3JvdGF0ZU91dCcsIHN0eWxlKHtvcGFjaXR5OiAwLCB0cmFuc2Zvcm06ICdyb3RhdGUoLTVkZWcpJ30pKSxcbiAgICAgIHRyYW5zaXRpb24oJ3JvdGF0ZSA9PiByb3RhdGVPdXQnLCBbXG4gICAgICAgIHN0eWxlKHtvcGFjaXR5OiAxLCB0cmFuc2Zvcm06ICdyb3RhdGUoMGRlZyknfSksXG4gICAgICAgIGFuaW1hdGUoJzQwMG1zIGVhc2UtaW4tb3V0JylcbiAgICAgIF0pXG4gICAgXSlcbiAgXSxcbiAgdGVtcGxhdGVVcmw6ICcuL25vdGlmaWNhdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25vdGlmaWNhdGlvbi5jb21wb25lbnQuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuXG4gIEBJbnB1dCgpIHRpbWVPdXQ6IG51bWJlcjtcbiAgQElucHV0KCkgc2hvd1Byb2dyZXNzQmFyOiBib29sZWFuO1xuICBASW5wdXQoKSBwYXVzZU9uSG92ZXI6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsaWNrVG9DbG9zZTogYm9vbGVhbjtcbiAgQElucHV0KCkgY2xpY2tJY29uVG9DbG9zZTogYm9vbGVhbjtcbiAgQElucHV0KCkgbWF4TGVuZ3RoOiBudW1iZXI7XG4gIEBJbnB1dCgpIHRoZUNsYXNzOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHJ0bDogYm9vbGVhbjtcbiAgQElucHV0KCkgYW5pbWF0ZTogTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZTtcbiAgQElucHV0KCkgcG9zaXRpb246IG51bWJlcjtcbiAgQElucHV0KCkgaXRlbTogTm90aWZpY2F0aW9uO1xuXG5cbiAgLy8gUHJvZ3Jlc3MgYmFyIHZhcmlhYmxlc1xuICB0aXRsZTogYW55O1xuICBjb250ZW50OiBhbnk7XG5cbiAgdGl0bGVJc1RlbXBsYXRlID0gZmFsc2U7XG4gIGNvbnRlbnRJc1RlbXBsYXRlID0gZmFsc2U7XG4gIGh0bWxJc1RlbXBsYXRlID0gZmFsc2U7XG5cbiAgcHJvZ3Jlc3NXaWR0aCA9IDA7XG4gIHNhZmVTdmc6IFNhZmVIdG1sO1xuICBzYWZlSW5wdXRIdG1sOiBTYWZlSHRtbDtcblxuICBwcml2YXRlIHN0b3BUaW1lID0gZmFsc2U7XG4gIHByaXZhdGUgdGltZXI6IGFueTtcbiAgcHJpdmF0ZSBmcmFtZXNQZXJTZWNvbmQgPSA0MDtcbiAgcHJpdmF0ZSBzbGVlcFRpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBzdGFydFRpbWU6IG51bWJlcjtcbiAgcHJpdmF0ZSBlbmRUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgcGF1c2VTdGFydDogbnVtYmVyO1xuXG4gIHByaXZhdGUgaWNvbjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgbm90aWZpY2F0aW9uU2VydmljZTogTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBkb21TYW5pdGl6ZXI6IERvbVNhbml0aXplcixcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMuaXRlbS5vdmVycmlkZSkge1xuICAgICAgdGhpcy5hdHRhY2hPdmVycmlkZXMoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hbmltYXRlKSB7XG4gICAgICB0aGlzLml0ZW0uc3RhdGUgPSB0aGlzLmFuaW1hdGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGltZU91dCAhPT0gMCkge1xuICAgICAgdGhpcy5zdGFydFRpbWVPdXQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnRUeXBlKHRoaXMuaXRlbS50aXRsZSwgJ3RpdGxlJyk7XG4gICAgdGhpcy5jb250ZW50VHlwZSh0aGlzLml0ZW0uY29udGVudCwgJ2NvbnRlbnQnKTtcbiAgICB0aGlzLmNvbnRlbnRUeXBlKHRoaXMuaXRlbS5odG1sLCAnaHRtbCcpO1xuXG4gICAgdGhpcy5zYWZlU3ZnID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwodGhpcy5pY29uIHx8IHRoaXMuaXRlbS5pY29uKTtcbiAgICB0aGlzLnNhZmVJbnB1dEh0bWwgPSB0aGlzLmRvbVNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbCh0aGlzLml0ZW0uaHRtbCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgdGhpcy5jZC5kZXRhY2goKTtcbiAgfVxuXG4gIHN0YXJ0VGltZU91dCgpOiB2b2lkIHtcbiAgICB0aGlzLnNsZWVwVGltZSA9IDEwMDAgLyB0aGlzLmZyYW1lc1BlclNlY29uZCAvKiBtcyAqLztcbiAgICB0aGlzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuZW5kVGltZSA9IHRoaXMuc3RhcnRUaW1lICsgdGhpcy50aW1lT3V0O1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLnRpbWVyID0gc2V0VGltZW91dCh0aGlzLmluc3RhbmNlLCB0aGlzLnNsZWVwVGltZSkpO1xuICB9XG5cbiAgb25FbnRlcigpIHtcbiAgICBpZiAodGhpcy5wYXVzZU9uSG92ZXIpIHtcbiAgICAgIHRoaXMuc3RvcFRpbWUgPSB0cnVlO1xuICAgICAgdGhpcy5wYXVzZVN0YXJ0ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgfVxuICB9XG5cbiAgb25MZWF2ZSgpIHtcbiAgICBpZiAodGhpcy5wYXVzZU9uSG92ZXIpIHtcbiAgICAgIHRoaXMuc3RvcFRpbWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuc3RhcnRUaW1lICs9IChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHRoaXMucGF1c2VTdGFydCk7XG4gICAgICB0aGlzLmVuZFRpbWUgKz0gKG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gdGhpcy5wYXVzZVN0YXJ0KTtcbiAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiBzZXRUaW1lb3V0KHRoaXMuaW5zdGFuY2UsIHRoaXMuc2xlZXBUaW1lKSk7XG4gICAgfVxuICB9XG5cbiAgb25DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIHRoaXMuaXRlbS5jbGljayEuZW1pdChldmVudCk7XG5cbiAgICBpZiAodGhpcy5jbGlja1RvQ2xvc2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGlja0ljb24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICB0aGlzLml0ZW0uY2xpY2tJY29uIS5lbWl0KGV2ZW50KTtcblxuICAgIGlmICh0aGlzLmNsaWNrSWNvblRvQ2xvc2UpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gQXR0YWNoIGFsbCB0aGUgb3ZlcnJpZGVzXG4gIGF0dGFjaE92ZXJyaWRlcygpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLml0ZW0ub3ZlcnJpZGUpLmZvckVhY2goYSA9PiB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShhKSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW2FdID0gdGhpcy5pdGVtLm92ZXJyaWRlW2FdO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnN0YW5jZSA9ICgpID0+IHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmICh0aGlzLmVuZFRpbWUgPCBub3cpIHtcbiAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICB0aGlzLml0ZW0udGltZW91dEVuZCEuZW1pdCgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RvcFRpbWUpIHtcbiAgICAgIGlmICh0aGlzLnNob3dQcm9ncmVzc0Jhcikge1xuICAgICAgICAvLyBXZSBhZGQgdGhpcy5zbGVlcFRpbWUganVzdCB0byBoYXZlIDEwMCUgYmVmb3JlIGNsb3NlXG4gICAgICAgIHRoaXMucHJvZ3Jlc3NXaWR0aCA9IE1hdGgubWluKChub3cgLSB0aGlzLnN0YXJ0VGltZSArIHRoaXMuc2xlZXBUaW1lKSAqIDEwMCAvIHRoaXMudGltZU91dCwgMTAwKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50aW1lciA9IHNldFRpbWVvdXQodGhpcy5pbnN0YW5jZSwgdGhpcy5zbGVlcFRpbWUpO1xuICAgIH1cbiAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgIGlmICghKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmUoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgdGhpcy5pdGVtLnN0YXRlID0gdGhpcy5hbmltYXRlICsgJ091dCc7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25TZXJ2aWNlLnNldCh0aGlzLml0ZW0sIGZhbHNlKTtcbiAgICAgIH0sIDMxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvblNlcnZpY2Uuc2V0KHRoaXMuaXRlbSwgZmFsc2UpO1xuICAgICAgfSwgNTMxMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb250ZW50VHlwZShpdGVtOiBhbnksIGtleTogc3RyaW5nKSB7XG4gICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZikge1xuICAgICAgdGhpc1trZXldID0gaXRlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpc1trZXldID0gdGhpcy5kb21TYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoaXRlbSk7XG4gICAgfVxuXG4gICAgdGhpc1trZXkgKyAnSXNUZW1wbGF0ZSddID0gaXRlbSBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmO1xuICB9XG59XG4iXX0=