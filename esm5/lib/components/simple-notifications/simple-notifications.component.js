var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, ChangeDetectorRef, ViewRef } from '@angular/core';
import { NotificationAnimationType } from '../../enums/notification-animation-type.enum';
import { NotificationsService } from '../../services/notifications.service';
var SimpleNotificationsComponent = /** @class */ (function () {
    function SimpleNotificationsComponent(service, cd) {
        this.service = service;
        this.cd = cd;
        this.create = new EventEmitter();
        this.destroy = new EventEmitter();
        this.notifications = [];
        this.position = ['bottom', 'right'];
        // Received values
        this.lastOnBottom = true;
        this.maxStack = 8;
        this.preventLastDuplicates = false;
        this.preventDuplicates = false;
        // Sent values
        this.timeOut = 0;
        this.maxLength = 0;
        this.clickToClose = true;
        this.clickIconToClose = false;
        this.showProgressBar = true;
        this.pauseOnHover = true;
        this.theClass = '';
        this.rtl = false;
        this.animate = NotificationAnimationType.FromRight;
        this.usingComponentOptions = false;
    }
    Object.defineProperty(SimpleNotificationsComponent.prototype, "options", {
        set: function (opt) {
            this.usingComponentOptions = true;
            this.attachChanges(opt);
        },
        enumerable: true,
        configurable: true
    });
    SimpleNotificationsComponent.prototype.ngOnInit = function () {
        var _this = this;
        /**
         * Only attach global options if config
         * options were never sent through input
         */
        if (!this.usingComponentOptions) {
            this.attachChanges(this.service.globalOptions);
        }
        this.listener = this.service.emitter
            .subscribe(function (item) {
            switch (item.command) {
                case 'cleanAll':
                    _this.notifications = [];
                    break;
                case 'clean':
                    _this.cleanSingle(item.id);
                    break;
                case 'set':
                    if (item.add) {
                        _this.add(item.notification);
                    }
                    else {
                        _this.defaultBehavior(item);
                    }
                    break;
                default:
                    _this.defaultBehavior(item);
                    break;
            }
            if (!_this.cd.destroyed) {
                _this.cd.detectChanges();
            }
        });
    };
    SimpleNotificationsComponent.prototype.ngOnDestroy = function () {
        if (this.listener) {
            this.listener.unsubscribe();
        }
        this.cd.detach();
    };
    // Default behavior on event
    SimpleNotificationsComponent.prototype.defaultBehavior = function (value) {
        this.notifications.splice(this.notifications.indexOf(value.notification), 1);
        this.destroy.emit(this.buildEmit(value.notification, false));
    };
    // Add the new notification to the notification array
    SimpleNotificationsComponent.prototype.add = function (item) {
        item.createdOn = new Date();
        var toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;
        // Save this as the last created notification
        this.lastNotificationCreated = item;
        // Override icon if set
        if (item.override && item.override.icons && item.override.icons[item.type]) {
            item.icon = item.override.icons[item.type];
        }
        if (!toBlock) {
            // Check if the notification should be added at the start or the end of the array
            if (this.lastOnBottom) {
                if (this.notifications.length >= this.maxStack) {
                    this.notifications.splice(0, 1);
                }
                this.notifications.push(item);
            }
            else {
                if (this.notifications.length >= this.maxStack) {
                    this.notifications.splice(this.notifications.length - 1, 1);
                }
                this.notifications.splice(0, 0, item);
            }
            this.create.emit(this.buildEmit(item, true));
        }
    };
    // Check if notifications should be prevented
    SimpleNotificationsComponent.prototype.block = function (item) {
        var e_1, _a;
        var toCheck = item.html ? this.checkHtml : this.checkStandard;
        if (this.preventDuplicates && this.notifications.length > 0) {
            try {
                for (var _b = __values(this.notifications), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var notification = _c.value;
                    if (toCheck(notification, item)) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (this.preventLastDuplicates) {
            var comp = void 0;
            if (this.preventLastDuplicates === 'visible' && this.notifications.length > 0) {
                if (this.lastOnBottom) {
                    comp = this.notifications[this.notifications.length - 1];
                }
                else {
                    comp = this.notifications[0];
                }
            }
            else if (this.preventLastDuplicates === 'all' && this.lastNotificationCreated) {
                comp = this.lastNotificationCreated;
            }
            else {
                return false;
            }
            return toCheck(comp, item);
        }
        return false;
    };
    SimpleNotificationsComponent.prototype.checkStandard = function (checker, item) {
        return checker.type === item.type && checker.title === item.title && checker.content === item.content;
    };
    SimpleNotificationsComponent.prototype.checkHtml = function (checker, item) {
        return checker.html ?
            checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html :
            false;
    };
    // Attach all the changes received in the options object
    SimpleNotificationsComponent.prototype.attachChanges = function (options) {
        for (var key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
            else if (key === 'icons') {
                this.service.icons = options[key];
            }
        }
    };
    SimpleNotificationsComponent.prototype.buildEmit = function (notification, to) {
        var toEmit = {
            createdOn: notification.createdOn,
            type: notification.type,
            icon: notification.icon,
            id: notification.id
        };
        if (notification.html) {
            toEmit.html = notification.html;
        }
        else {
            toEmit.title = notification.title;
            toEmit.content = notification.content;
        }
        if (!to) {
            toEmit.destroyedOn = new Date();
        }
        return toEmit;
    };
    SimpleNotificationsComponent.prototype.cleanSingle = function (id) {
        var indexOfDelete = 0;
        var doDelete = false;
        var noti;
        this.notifications.forEach(function (notification, idx) {
            if (notification.id === id) {
                indexOfDelete = idx;
                noti = notification;
                doDelete = true;
            }
        });
        if (doDelete) {
            this.notifications.splice(indexOfDelete, 1);
            this.destroy.emit(this.buildEmit(noti, false));
        }
    };
    SimpleNotificationsComponent.ctorParameters = function () { return [
        { type: NotificationsService },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], SimpleNotificationsComponent.prototype, "options", null);
    __decorate([
        Output()
    ], SimpleNotificationsComponent.prototype, "create", void 0);
    __decorate([
        Output()
    ], SimpleNotificationsComponent.prototype, "destroy", void 0);
    SimpleNotificationsComponent = __decorate([
        Component({
            selector: 'simple-notifications',
            encapsulation: ViewEncapsulation.None,
            template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>",
            changeDetection: ChangeDetectionStrategy.OnPush,
            styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translateX(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width:340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}"]
        })
    ], SimpleNotificationsComponent);
    return SimpleNotificationsComponent;
}());
export { SimpleNotificationsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbm90aWZpY2F0aW9ucy8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3NpbXBsZS1ub3RpZmljYXRpb25zL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFbEssT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFHekYsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFTNUU7SUFDRSxzQ0FDVSxPQUE2QixFQUM3QixFQUFxQjtRQURyQixZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVFyQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2QyxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsYUFBUSxHQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBS3pDLGtCQUFrQjtRQUNWLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYiwwQkFBcUIsR0FBUSxLQUFLLENBQUM7UUFDbkMsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBRWxDLGNBQWM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLHFC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QXNCO1lBQ2hDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO1lBQ3JDLGtuQkFBb0Q7WUFFcEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07O1NBQ2hELENBQUM7T0FDVyw0QkFBNEIsQ0E4TnhDO0lBQUQsbUNBQUM7Q0FBQSxBQTlORCxJQThOQztTQTlOWSw0QkFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZSB9IGZyb20gJy4uLy4uL2VudW1zL25vdGlmaWNhdGlvbi1hbmltYXRpb24tdHlwZS5lbnVtJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm90aWZpY2F0aW9uLnR5cGUnO1xuaW1wb3J0IHsgT3B0aW9ucywgUG9zaXRpb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL29wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NpbXBsZS1ub3RpZmljYXRpb25zJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBTaW1wbGVOb3RpZmljYXRpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHNlcnZpY2U6IE5vdGlmaWNhdGlvbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICkgeyB9XG5cbiAgQElucHV0KCkgc2V0IG9wdGlvbnMob3B0OiBPcHRpb25zKSB7XG4gICAgdGhpcy51c2luZ0NvbXBvbmVudE9wdGlvbnMgPSB0cnVlO1xuICAgIHRoaXMuYXR0YWNoQ2hhbmdlcyhvcHQpO1xuICB9XG5cbiAgQE91dHB1dCgpIGNyZWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgbm90aWZpY2F0aW9uczogTm90aWZpY2F0aW9uW10gPSBbXTtcbiAgcG9zaXRpb246IFBvc2l0aW9uID0gWydib3R0b20nLCAncmlnaHQnXTtcblxuICBwcml2YXRlIGxhc3ROb3RpZmljYXRpb25DcmVhdGVkOiBOb3RpZmljYXRpb247XG4gIHByaXZhdGUgbGlzdGVuZXI6IFN1YnNjcmlwdGlvbjtcblxuICAvLyBSZWNlaXZlZCB2YWx1ZXNcbiAgcHJpdmF0ZSBsYXN0T25Cb3R0b20gPSB0cnVlO1xuICBwcml2YXRlIG1heFN0YWNrID0gODtcbiAgcHJpdmF0ZSBwcmV2ZW50TGFzdER1cGxpY2F0ZXM6IGFueSA9IGZhbHNlO1xuICBwcml2YXRlIHByZXZlbnREdXBsaWNhdGVzID0gZmFsc2U7XG5cbiAgLy8gU2VudCB2YWx1ZXNcbiAgdGltZU91dCA9IDA7XG4gIG1heExlbmd0aCA9IDA7XG4gIGNsaWNrVG9DbG9zZSA9IHRydWU7XG4gIGNsaWNrSWNvblRvQ2xvc2UgPSBmYWxzZTtcbiAgc2hvd1Byb2dyZXNzQmFyID0gdHJ1ZTtcbiAgcGF1c2VPbkhvdmVyID0gdHJ1ZTtcbiAgdGhlQ2xhc3MgPSAnJztcbiAgcnRsID0gZmFsc2U7XG4gIGFuaW1hdGU6IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUgPSBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlLkZyb21SaWdodDtcblxuICBwcml2YXRlIHVzaW5nQ29tcG9uZW50T3B0aW9ucyA9IGZhbHNlO1xuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLyoqXG4gICAgICogT25seSBhdHRhY2ggZ2xvYmFsIG9wdGlvbnMgaWYgY29uZmlnXG4gICAgICogb3B0aW9ucyB3ZXJlIG5ldmVyIHNlbnQgdGhyb3VnaCBpbnB1dFxuICAgICAqL1xuICAgIGlmICghdGhpcy51c2luZ0NvbXBvbmVudE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYXR0YWNoQ2hhbmdlcyhcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmdsb2JhbE9wdGlvbnNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lciA9IHRoaXMuc2VydmljZS5lbWl0dGVyXG4gICAgICAuc3Vic2NyaWJlKGl0ZW0gPT4ge1xuICAgICAgICBzd2l0Y2ggKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgIGNhc2UgJ2NsZWFuQWxsJzpcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdjbGVhbic6XG4gICAgICAgICAgICB0aGlzLmNsZWFuU2luZ2xlKGl0ZW0uaWQhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgICAgIGlmIChpdGVtLmFkZCkge1xuICAgICAgICAgICAgICB0aGlzLmFkZChpdGVtLm5vdGlmaWNhdGlvbiEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0QmVoYXZpb3IoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRCZWhhdmlvcihpdGVtKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5jZC5kZXRhY2goKTtcbiAgfVxuXG4gIC8vIERlZmF1bHQgYmVoYXZpb3Igb24gZXZlbnRcbiAgZGVmYXVsdEJlaGF2aW9yKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKHRoaXMubm90aWZpY2F0aW9ucy5pbmRleE9mKHZhbHVlLm5vdGlmaWNhdGlvbiksIDEpO1xuICAgIHRoaXMuZGVzdHJveS5lbWl0KHRoaXMuYnVpbGRFbWl0KHZhbHVlLm5vdGlmaWNhdGlvbiwgZmFsc2UpKTtcbiAgfVxuXG5cbiAgLy8gQWRkIHRoZSBuZXcgbm90aWZpY2F0aW9uIHRvIHRoZSBub3RpZmljYXRpb24gYXJyYXlcbiAgYWRkKGl0ZW06IE5vdGlmaWNhdGlvbik6IHZvaWQge1xuICAgIGl0ZW0uY3JlYXRlZE9uID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IHRvQmxvY2s6IGJvb2xlYW4gPSB0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyB8fCB0aGlzLnByZXZlbnREdXBsaWNhdGVzID8gdGhpcy5ibG9jayhpdGVtKSA6IGZhbHNlO1xuXG4gICAgLy8gU2F2ZSB0aGlzIGFzIHRoZSBsYXN0IGNyZWF0ZWQgbm90aWZpY2F0aW9uXG4gICAgdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZCA9IGl0ZW07XG4gICAgLy8gT3ZlcnJpZGUgaWNvbiBpZiBzZXRcbiAgICBpZiAoaXRlbS5vdmVycmlkZSAmJiBpdGVtLm92ZXJyaWRlLmljb25zICYmIGl0ZW0ub3ZlcnJpZGUuaWNvbnNbaXRlbS50eXBlXSkge1xuICAgICAgaXRlbS5pY29uID0gaXRlbS5vdmVycmlkZS5pY29uc1tpdGVtLnR5cGVdO1xuICAgIH1cblxuICAgIGlmICghdG9CbG9jaykge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIG5vdGlmaWNhdGlvbiBzaG91bGQgYmUgYWRkZWQgYXQgdGhlIHN0YXJ0IG9yIHRoZSBlbmQgb2YgdGhlIGFycmF5XG4gICAgICBpZiAodGhpcy5sYXN0T25Cb3R0b20pIHtcbiAgICAgICAgaWYgKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPj0gdGhpcy5tYXhTdGFjaykge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoMCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMucHVzaChpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID49IHRoaXMubWF4U3RhY2spIHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoMCwgMCwgaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlLmVtaXQodGhpcy5idWlsZEVtaXQoaXRlbSwgdHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGlmIG5vdGlmaWNhdGlvbnMgc2hvdWxkIGJlIHByZXZlbnRlZFxuICBibG9jayhpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcblxuICAgIGNvbnN0IHRvQ2hlY2sgPSBpdGVtLmh0bWwgPyB0aGlzLmNoZWNrSHRtbCA6IHRoaXMuY2hlY2tTdGFuZGFyZDtcblxuICAgIGlmICh0aGlzLnByZXZlbnREdXBsaWNhdGVzICYmIHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGNvbnN0IG5vdGlmaWNhdGlvbiBvZiB0aGlzLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgaWYgKHRvQ2hlY2sobm90aWZpY2F0aW9uLCBpdGVtKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzKSB7XG5cbiAgICAgIGxldCBjb21wOiBOb3RpZmljYXRpb247XG5cbiAgICAgIGlmICh0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyA9PT0gJ3Zpc2libGUnICYmIHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RPbkJvdHRvbSkge1xuICAgICAgICAgIGNvbXAgPSB0aGlzLm5vdGlmaWNhdGlvbnNbdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXAgPSB0aGlzLm5vdGlmaWNhdGlvbnNbMF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMgPT09ICdhbGwnICYmIHRoaXMubGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQpIHtcbiAgICAgICAgY29tcCA9IHRoaXMubGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9DaGVjayhjb21wLCBpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjaGVja1N0YW5kYXJkKGNoZWNrZXI6IE5vdGlmaWNhdGlvbiwgaXRlbTogTm90aWZpY2F0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNoZWNrZXIudHlwZSA9PT0gaXRlbS50eXBlICYmIGNoZWNrZXIudGl0bGUgPT09IGl0ZW0udGl0bGUgJiYgY2hlY2tlci5jb250ZW50ID09PSBpdGVtLmNvbnRlbnQ7XG4gIH1cblxuICBjaGVja0h0bWwoY2hlY2tlcjogTm90aWZpY2F0aW9uLCBpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hlY2tlci5odG1sID9cbiAgICAgIGNoZWNrZXIudHlwZSA9PT0gaXRlbS50eXBlICYmIGNoZWNrZXIudGl0bGUgPT09IGl0ZW0udGl0bGUgJiYgY2hlY2tlci5jb250ZW50ID09PSBpdGVtLmNvbnRlbnQgJiYgY2hlY2tlci5odG1sID09PSBpdGVtLmh0bWwgOlxuICAgICAgZmFsc2U7XG4gIH1cblxuICAvLyBBdHRhY2ggYWxsIHRoZSBjaGFuZ2VzIHJlY2VpdmVkIGluIHRoZSBvcHRpb25zIG9iamVjdFxuICBhdHRhY2hDaGFuZ2VzKG9wdGlvbnM6IGFueSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdpY29ucycpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmljb25zID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGJ1aWxkRW1pdChub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbiwgdG86IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0b0VtaXQ6IE5vdGlmaWNhdGlvbiA9IHtcbiAgICAgIGNyZWF0ZWRPbjogbm90aWZpY2F0aW9uLmNyZWF0ZWRPbixcbiAgICAgIHR5cGU6IG5vdGlmaWNhdGlvbi50eXBlLFxuICAgICAgaWNvbjogbm90aWZpY2F0aW9uLmljb24sXG4gICAgICBpZDogbm90aWZpY2F0aW9uLmlkXG4gICAgfTtcblxuICAgIGlmIChub3RpZmljYXRpb24uaHRtbCkge1xuICAgICAgdG9FbWl0Lmh0bWwgPSBub3RpZmljYXRpb24uaHRtbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9FbWl0LnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlO1xuICAgICAgdG9FbWl0LmNvbnRlbnQgPSBub3RpZmljYXRpb24uY29udGVudDtcbiAgICB9XG5cbiAgICBpZiAoIXRvKSB7XG4gICAgICB0b0VtaXQuZGVzdHJveWVkT24gPSBuZXcgRGF0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0VtaXQ7XG4gIH1cblxuICBjbGVhblNpbmdsZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGluZGV4T2ZEZWxldGUgPSAwO1xuICAgIGxldCBkb0RlbGV0ZSA9IGZhbHNlO1xuICAgIGxldCBub3RpO1xuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zLmZvckVhY2goKG5vdGlmaWNhdGlvbiwgaWR4KSA9PiB7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLmlkID09PSBpZCkge1xuICAgICAgICBpbmRleE9mRGVsZXRlID0gaWR4O1xuICAgICAgICBub3RpID0gbm90aWZpY2F0aW9uO1xuICAgICAgICBkb0RlbGV0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZG9EZWxldGUpIHtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoaW5kZXhPZkRlbGV0ZSwgMSk7XG4gICAgICB0aGlzLmRlc3Ryb3kuZW1pdCh0aGlzLmJ1aWxkRW1pdChub3RpLCBmYWxzZSkpO1xuICAgIH1cbiAgfVxufVxuIl19