var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, ChangeDetectorRef, ViewRef } from '@angular/core';
import { NotificationAnimationType } from '../../enums/notification-animation-type.enum';
import { NotificationsService } from '../../services/notifications.service';
let SimpleNotificationsComponent = class SimpleNotificationsComponent {
    constructor(service, cd) {
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
    set options(opt) {
        this.usingComponentOptions = true;
        this.attachChanges(opt);
    }
    ngOnInit() {
        /**
         * Only attach global options if config
         * options were never sent through input
         */
        if (!this.usingComponentOptions) {
            this.attachChanges(this.service.globalOptions);
        }
        this.listener = this.service.emitter
            .subscribe(item => {
            switch (item.command) {
                case 'cleanAll':
                    this.notifications = [];
                    break;
                case 'clean':
                    this.cleanSingle(item.id);
                    break;
                case 'set':
                    if (item.add) {
                        this.add(item.notification);
                    }
                    else {
                        this.defaultBehavior(item);
                    }
                    break;
                default:
                    this.defaultBehavior(item);
                    break;
            }
            if (!this.cd.destroyed) {
                this.cd.detectChanges();
            }
        });
    }
    ngOnDestroy() {
        if (this.listener) {
            this.listener.unsubscribe();
        }
        this.cd.detach();
    }
    // Default behavior on event
    defaultBehavior(value) {
        this.notifications.splice(this.notifications.indexOf(value.notification), 1);
        this.destroy.emit(this.buildEmit(value.notification, false));
    }
    // Add the new notification to the notification array
    add(item) {
        item.createdOn = new Date();
        const toBlock = this.preventLastDuplicates || this.preventDuplicates ? this.block(item) : false;
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
    }
    // Check if notifications should be prevented
    block(item) {
        const toCheck = item.html ? this.checkHtml : this.checkStandard;
        if (this.preventDuplicates && this.notifications.length > 0) {
            for (const notification of this.notifications) {
                if (toCheck(notification, item)) {
                    return true;
                }
            }
        }
        if (this.preventLastDuplicates) {
            let comp;
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
    }
    checkStandard(checker, item) {
        return checker.type === item.type && checker.title === item.title && checker.content === item.content;
    }
    checkHtml(checker, item) {
        return checker.html ?
            checker.type === item.type && checker.title === item.title && checker.content === item.content && checker.html === item.html :
            false;
    }
    // Attach all the changes received in the options object
    attachChanges(options) {
        for (const key in options) {
            if (this.hasOwnProperty(key)) {
                this[key] = options[key];
            }
            else if (key === 'icons') {
                this.service.icons = options[key];
            }
        }
    }
    buildEmit(notification, to) {
        const toEmit = {
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
    }
    cleanSingle(id) {
        let indexOfDelete = 0;
        let doDelete = false;
        let noti;
        this.notifications.forEach((notification, idx) => {
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
    }
};
SimpleNotificationsComponent.ctorParameters = () => [
    { type: NotificationsService },
    { type: ChangeDetectorRef }
];
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
export { SimpleNotificationsComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItbm90aWZpY2F0aW9ucy8iLCJzb3VyY2VzIjpbImxpYi9jb21wb25lbnRzL3NpbXBsZS1ub3RpZmljYXRpb25zL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRWxLLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDO0FBR3pGLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBUzVFLElBQWEsNEJBQTRCLEdBQXpDLE1BQWEsNEJBQTRCO0lBQ3ZDLFlBQ1UsT0FBNkIsRUFDN0IsRUFBcUI7UUFEckIsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFDN0IsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFRckIsV0FBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDNUIsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdkMsa0JBQWEsR0FBbUIsRUFBRSxDQUFDO1FBQ25DLGFBQVEsR0FBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUt6QyxrQkFBa0I7UUFDVixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsMEJBQXFCLEdBQVEsS0FBSyxDQUFDO1FBQ25DLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUVsQyxjQUFjO1FBQ2QsWUFBTyxHQUFHLENBQUMsQ0FBQztRQUNaLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxpQkFBWSxHQUFH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R0FDVyw0QkFBNEIsQ0E4TnhDO1NBOU5ZLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZiwgVmlld1JlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlIH0gZnJvbSAnLi4vLi4vZW51bXMvbm90aWZpY2F0aW9uLWFuaW1hdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub3RpZmljYXRpb24udHlwZSc7XG5pbXBvcnQgeyBPcHRpb25zLCBQb3NpdGlvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2ltcGxlLW5vdGlmaWNhdGlvbnMnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJy4vc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFNpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2VydmljZTogTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7IH1cblxuICBASW5wdXQoKSBzZXQgb3B0aW9ucyhvcHQ6IE9wdGlvbnMpIHtcbiAgICB0aGlzLnVzaW5nQ29tcG9uZW50T3B0aW9ucyA9IHRydWU7XG4gICAgdGhpcy5hdHRhY2hDaGFuZ2VzKG9wdCk7XG4gIH1cblxuICBAT3V0cHV0KCkgY3JlYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBub3RpZmljYXRpb25zOiBOb3RpZmljYXRpb25bXSA9IFtdO1xuICBwb3NpdGlvbjogUG9zaXRpb24gPSBbJ2JvdHRvbScsICdyaWdodCddO1xuXG4gIHByaXZhdGUgbGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQ6IE5vdGlmaWNhdGlvbjtcbiAgcHJpdmF0ZSBsaXN0ZW5lcjogU3Vic2NyaXB0aW9uO1xuXG4gIC8vIFJlY2VpdmVkIHZhbHVlc1xuICBwcml2YXRlIGxhc3RPbkJvdHRvbSA9IHRydWU7XG4gIHByaXZhdGUgbWF4U3RhY2sgPSA4O1xuICBwcml2YXRlIHByZXZlbnRMYXN0RHVwbGljYXRlczogYW55ID0gZmFsc2U7XG4gIHByaXZhdGUgcHJldmVudER1cGxpY2F0ZXMgPSBmYWxzZTtcblxuICAvLyBTZW50IHZhbHVlc1xuICB0aW1lT3V0ID0gMDtcbiAgbWF4TGVuZ3RoID0gMDtcbiAgY2xpY2tUb0Nsb3NlID0gdHJ1ZTtcbiAgY2xpY2tJY29uVG9DbG9zZSA9IGZhbHNlO1xuICBzaG93UHJvZ3Jlc3NCYXIgPSB0cnVlO1xuICBwYXVzZU9uSG92ZXIgPSB0cnVlO1xuICB0aGVDbGFzcyA9ICcnO1xuICBydGwgPSBmYWxzZTtcbiAgYW5pbWF0ZTogTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZSA9IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUuRnJvbVJpZ2h0O1xuXG4gIHByaXZhdGUgdXNpbmdDb21wb25lbnRPcHRpb25zID0gZmFsc2U7XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBPbmx5IGF0dGFjaCBnbG9iYWwgb3B0aW9ucyBpZiBjb25maWdcbiAgICAgKiBvcHRpb25zIHdlcmUgbmV2ZXIgc2VudCB0aHJvdWdoIGlucHV0XG4gICAgICovXG4gICAgaWYgKCF0aGlzLnVzaW5nQ29tcG9uZW50T3B0aW9ucykge1xuICAgICAgdGhpcy5hdHRhY2hDaGFuZ2VzKFxuICAgICAgICB0aGlzLnNlcnZpY2UuZ2xvYmFsT3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gdGhpcy5zZXJ2aWNlLmVtaXR0ZXJcbiAgICAgIC5zdWJzY3JpYmUoaXRlbSA9PiB7XG4gICAgICAgIHN3aXRjaCAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgY2FzZSAnY2xlYW5BbGwnOlxuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2NsZWFuJzpcbiAgICAgICAgICAgIHRoaXMuY2xlYW5TaW5nbGUoaXRlbS5pZCEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZXQnOlxuICAgICAgICAgICAgaWYgKGl0ZW0uYWRkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkKGl0ZW0ubm90aWZpY2F0aW9uISk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRCZWhhdmlvcihpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdEJlaGF2aW9yKGl0ZW0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEodGhpcy5jZCBhcyBWaWV3UmVmKS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgdGhpcy5saXN0ZW5lci51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmNkLmRldGFjaCgpO1xuICB9XG5cbiAgLy8gRGVmYXVsdCBiZWhhdmlvciBvbiBldmVudFxuICBkZWZhdWx0QmVoYXZpb3IodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UodGhpcy5ub3RpZmljYXRpb25zLmluZGV4T2YodmFsdWUubm90aWZpY2F0aW9uKSwgMSk7XG4gICAgdGhpcy5kZXN0cm95LmVtaXQodGhpcy5idWlsZEVtaXQodmFsdWUubm90aWZpY2F0aW9uLCBmYWxzZSkpO1xuICB9XG5cblxuICAvLyBBZGQgdGhlIG5ldyBub3RpZmljYXRpb24gdG8gdGhlIG5vdGlmaWNhdGlvbiBhcnJheVxuICBhZGQoaXRlbTogTm90aWZpY2F0aW9uKTogdm9pZCB7XG4gICAgaXRlbS5jcmVhdGVkT24gPSBuZXcgRGF0ZSgpO1xuXG4gICAgY29uc3QgdG9CbG9jazogYm9vbGVhbiA9IHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzIHx8IHRoaXMucHJldmVudER1cGxpY2F0ZXMgPyB0aGlzLmJsb2NrKGl0ZW0pIDogZmFsc2U7XG5cbiAgICAvLyBTYXZlIHRoaXMgYXMgdGhlIGxhc3QgY3JlYXRlZCBub3RpZmljYXRpb25cbiAgICB0aGlzLmxhc3ROb3RpZmljYXRpb25DcmVhdGVkID0gaXRlbTtcbiAgICAvLyBPdmVycmlkZSBpY29uIGlmIHNldFxuICAgIGlmIChpdGVtLm92ZXJyaWRlICYmIGl0ZW0ub3ZlcnJpZGUuaWNvbnMgJiYgaXRlbS5vdmVycmlkZS5pY29uc1tpdGVtLnR5cGVdKSB7XG4gICAgICBpdGVtLmljb24gPSBpdGVtLm92ZXJyaWRlLmljb25zW2l0ZW0udHlwZV07XG4gICAgfVxuXG4gICAgaWYgKCF0b0Jsb2NrKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgbm90aWZpY2F0aW9uIHNob3VsZCBiZSBhZGRlZCBhdCB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgYXJyYXlcbiAgICAgIGlmICh0aGlzLmxhc3RPbkJvdHRvbSkge1xuICAgICAgICBpZiAodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+PSB0aGlzLm1heFN0YWNrKSB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSgwLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPj0gdGhpcy5tYXhTdGFjaykge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSgwLCAwLCBpdGVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jcmVhdGUuZW1pdCh0aGlzLmJ1aWxkRW1pdChpdGVtLCB0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgbm90aWZpY2F0aW9ucyBzaG91bGQgYmUgcHJldmVudGVkXG4gIGJsb2NrKGl0ZW06IE5vdGlmaWNhdGlvbik6IGJvb2xlYW4ge1xuXG4gICAgY29uc3QgdG9DaGVjayA9IGl0ZW0uaHRtbCA/IHRoaXMuY2hlY2tIdG1sIDogdGhpcy5jaGVja1N0YW5kYXJkO1xuXG4gICAgaWYgKHRoaXMucHJldmVudER1cGxpY2F0ZXMgJiYgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAoY29uc3Qgbm90aWZpY2F0aW9uIG9mIHRoaXMubm90aWZpY2F0aW9ucykge1xuICAgICAgICBpZiAodG9DaGVjayhub3RpZmljYXRpb24sIGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMpIHtcblxuICAgICAgbGV0IGNvbXA6IE5vdGlmaWNhdGlvbjtcblxuICAgICAgaWYgKHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzID09PSAndmlzaWJsZScgJiYgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdE9uQm90dG9tKSB7XG4gICAgICAgICAgY29tcCA9IHRoaXMubm90aWZpY2F0aW9uc1t0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoIC0gMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tcCA9IHRoaXMubm90aWZpY2F0aW9uc1swXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyA9PT0gJ2FsbCcgJiYgdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZCkge1xuICAgICAgICBjb21wID0gdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b0NoZWNrKGNvbXAsIGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNoZWNrU3RhbmRhcmQoY2hlY2tlcjogTm90aWZpY2F0aW9uLCBpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hlY2tlci50eXBlID09PSBpdGVtLnR5cGUgJiYgY2hlY2tlci50aXRsZSA9PT0gaXRlbS50aXRsZSAmJiBjaGVja2VyLmNvbnRlbnQgPT09IGl0ZW0uY29udGVudDtcbiAgfVxuXG4gIGNoZWNrSHRtbChjaGVja2VyOiBOb3RpZmljYXRpb24sIGl0ZW06IE5vdGlmaWNhdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjaGVja2VyLmh0bWwgP1xuICAgICAgY2hlY2tlci50eXBlID09PSBpdGVtLnR5cGUgJiYgY2hlY2tlci50aXRsZSA9PT0gaXRlbS50aXRsZSAmJiBjaGVja2VyLmNvbnRlbnQgPT09IGl0ZW0uY29udGVudCAmJiBjaGVja2VyLmh0bWwgPT09IGl0ZW0uaHRtbCA6XG4gICAgICBmYWxzZTtcbiAgfVxuXG4gIC8vIEF0dGFjaCBhbGwgdGhlIGNoYW5nZXMgcmVjZWl2ZWQgaW4gdGhlIG9wdGlvbnMgb2JqZWN0XG4gIGF0dGFjaENoYW5nZXMob3B0aW9uczogYW55KSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2ljb25zJykge1xuICAgICAgICB0aGlzLnNlcnZpY2UuaWNvbnMgPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnVpbGRFbWl0KG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLCB0bzogYm9vbGVhbikge1xuICAgIGNvbnN0IHRvRW1pdDogTm90aWZpY2F0aW9uID0ge1xuICAgICAgY3JlYXRlZE9uOiBub3RpZmljYXRpb24uY3JlYXRlZE9uLFxuICAgICAgdHlwZTogbm90aWZpY2F0aW9uLnR5cGUsXG4gICAgICBpY29uOiBub3RpZmljYXRpb24uaWNvbixcbiAgICAgIGlkOiBub3RpZmljYXRpb24uaWRcbiAgICB9O1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5odG1sKSB7XG4gICAgICB0b0VtaXQuaHRtbCA9IG5vdGlmaWNhdGlvbi5odG1sO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0VtaXQudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICB0b0VtaXQuY29udGVudCA9IG5vdGlmaWNhdGlvbi5jb250ZW50O1xuICAgIH1cblxuICAgIGlmICghdG8pIHtcbiAgICAgIHRvRW1pdC5kZXN0cm95ZWRPbiA9IG5ldyBEYXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvRW1pdDtcbiAgfVxuXG4gIGNsZWFuU2luZ2xlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgaW5kZXhPZkRlbGV0ZSA9IDA7XG4gICAgbGV0IGRvRGVsZXRlID0gZmFsc2U7XG4gICAgbGV0IG5vdGk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuZm9yRWFjaCgobm90aWZpY2F0aW9uLCBpZHgpID0+IHtcbiAgICAgIGlmIChub3RpZmljYXRpb24uaWQgPT09IGlkKSB7XG4gICAgICAgIGluZGV4T2ZEZWxldGUgPSBpZHg7XG4gICAgICAgIG5vdGkgPSBub3RpZmljYXRpb247XG4gICAgICAgIGRvRGVsZXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkb0RlbGV0ZSkge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZShpbmRleE9mRGVsZXRlLCAxKTtcbiAgICAgIHRoaXMuZGVzdHJveS5lbWl0KHRoaXMuYnVpbGRFbWl0KG5vdGksIGZhbHNlKSk7XG4gICAgfVxuICB9XG59XG4iXX0=