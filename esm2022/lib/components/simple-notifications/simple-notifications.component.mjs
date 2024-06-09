import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NotificationAnimationType } from '../../enums/notification-animation-type.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../services/notifications.service";
import * as i2 from "@angular/common";
import * as i3 from "../notification/notification.component";
export class SimpleNotificationsComponent {
    service;
    cd;
    constructor(service, cd) {
        this.service = service;
        this.cd = cd;
    }
    set options(opt) {
        this.usingComponentOptions = true;
        this.attachChanges(opt);
    }
    create = new EventEmitter();
    destroy = new EventEmitter();
    notifications = [];
    position = ['bottom', 'right'];
    lastNotificationCreated;
    listener;
    // Received values
    lastOnBottom = true;
    maxStack = 8;
    preventLastDuplicates = false;
    preventDuplicates = false;
    // Sent values
    timeOut = 0;
    maxLength = 0;
    clickToClose = true;
    clickIconToClose = false;
    showProgressBar = true;
    pauseOnHover = true;
    theClass = '';
    rtl = false;
    animate = NotificationAnimationType.FromRight;
    usingComponentOptions = false;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsComponent, deps: [{ token: i1.NotificationsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.11", type: SimpleNotificationsComponent, selector: "simple-notifications", inputs: { options: "options" }, outputs: { create: "create", destroy: "destroy" }, ngImport: i0, template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>", styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: i3.NotificationComponent, selector: "simple-notification", inputs: ["timeOut", "showProgressBar", "pauseOnHover", "clickToClose", "clickIconToClose", "maxLength", "theClass", "rtl", "animate", "position", "item"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'simple-notifications', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>", styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NotificationsService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { options: [{
                type: Input
            }], create: [{
                type: Output
            }], destroy: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhcjItbm90aWZpY2F0aW9ucy9zcmMvbGliL2NvbXBvbmVudHMvc2ltcGxlLW5vdGlmaWNhdGlvbnMvc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhcjItbm90aWZpY2F0aW9ucy9zcmMvbGliL2NvbXBvbmVudHMvc2ltcGxlLW5vdGlmaWNhdGlvbnMvc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFxQixNQUFNLEVBQUUsaUJBQWlCLEVBQThCLE1BQU0sZUFBZSxDQUFDO0FBRWxLLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhDQUE4QyxDQUFDOzs7OztBQVl6RixNQUFNLE9BQU8sNEJBQTRCO0lBRTdCO0lBQ0E7SUFGVixZQUNVLE9BQTZCLEVBQzdCLEVBQXFCO1FBRHJCLFlBQU8sR0FBUCxPQUFPLENBQXNCO1FBQzdCLE9BQUUsR0FBRixFQUFFLENBQW1CO0lBQzNCLENBQUM7SUFFTCxJQUFhLE9BQU8sQ0FBQyxHQUFZO1FBQy9CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVMsTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDNUIsT0FBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFFdkMsYUFBYSxHQUFtQixFQUFFLENBQUM7SUFDbkMsUUFBUSxHQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRWpDLHVCQUF1QixD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RyxPQUFPO3NCQUFoQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb24sIENoYW5nZURldGVjdG9yUmVmLCBWaWV3UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUgfSBmcm9tICcuLi8uLi9lbnVtcy9ub3RpZmljYXRpb24tYW5pbWF0aW9uLXR5cGUuZW51bSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vdGlmaWNhdGlvbi50eXBlJztcbmltcG9ydCB7IE9wdGlvbnMsIFBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9vcHRpb25zLnR5cGUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub3RpZmljYXRpb25zLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdzaW1wbGUtbm90aWZpY2F0aW9ucycsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlVXJsOiAnLi9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC5jc3MnXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgU2ltcGxlTm90aWZpY2F0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBzZXJ2aWNlOiBOb3RpZmljYXRpb25zU2VydmljZSxcbiAgICBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZlxuICApIHsgfVxuXG4gIEBJbnB1dCgpIHNldCBvcHRpb25zKG9wdDogT3B0aW9ucykge1xuICAgIHRoaXMudXNpbmdDb21wb25lbnRPcHRpb25zID0gdHJ1ZTtcbiAgICB0aGlzLmF0dGFjaENoYW5nZXMob3B0KTtcbiAgfVxuXG4gIEBPdXRwdXQoKSBjcmVhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBPdXRwdXQoKSBkZXN0cm95ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIG5vdGlmaWNhdGlvbnM6IE5vdGlmaWNhdGlvbltdID0gW107XG4gIHBvc2l0aW9uOiBQb3NpdGlvbiA9IFsnYm90dG9tJywgJ3JpZ2h0J107XG5cbiAgcHJpdmF0ZSBsYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZDogTm90aWZpY2F0aW9uO1xuICBwcml2YXRlIGxpc3RlbmVyOiBTdWJzY3JpcHRpb247XG5cbiAgLy8gUmVjZWl2ZWQgdmFsdWVzXG4gIHByaXZhdGUgbGFzdE9uQm90dG9tID0gdHJ1ZTtcbiAgcHJpdmF0ZSBtYXhTdGFjayA9IDg7XG4gIHByaXZhdGUgcHJldmVudExhc3REdXBsaWNhdGVzOiBhbnkgPSBmYWxzZTtcbiAgcHJpdmF0ZSBwcmV2ZW50RHVwbGljYXRlcyA9IGZhbHNlO1xuXG4gIC8vIFNlbnQgdmFsdWVzXG4gIHRpbWVPdXQgPSAwO1xuICBtYXhMZW5ndGggPSAwO1xuICBjbGlja1RvQ2xvc2UgPSB0cnVlO1xuICBjbGlja0ljb25Ub0Nsb3NlID0gZmFsc2U7XG4gIHNob3dQcm9ncmVzc0JhciA9IHRydWU7XG4gIHBhdXNlT25Ib3ZlciA9IHRydWU7XG4gIHRoZUNsYXNzID0gJyc7XG4gIHJ0bCA9IGZhbHNlO1xuICBhbmltYXRlOiBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlID0gTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZS5Gcm9tUmlnaHQ7XG5cbiAgcHJpdmF0ZSB1c2luZ0NvbXBvbmVudE9wdGlvbnMgPSBmYWxzZTtcblxuICBuZ09uSW5pdCgpIHtcblxuICAgIC8qKlxuICAgICAqIE9ubHkgYXR0YWNoIGdsb2JhbCBvcHRpb25zIGlmIGNvbmZpZ1xuICAgICAqIG9wdGlvbnMgd2VyZSBuZXZlciBzZW50IHRocm91Z2ggaW5wdXRcbiAgICAgKi9cbiAgICBpZiAoIXRoaXMudXNpbmdDb21wb25lbnRPcHRpb25zKSB7XG4gICAgICB0aGlzLmF0dGFjaENoYW5nZXMoXG4gICAgICAgIHRoaXMuc2VydmljZS5nbG9iYWxPcHRpb25zXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMubGlzdGVuZXIgPSB0aGlzLnNlcnZpY2UuZW1pdHRlclxuICAgICAgLnN1YnNjcmliZShpdGVtID0+IHtcbiAgICAgICAgc3dpdGNoIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICBjYXNlICdjbGVhbkFsbCc6XG4gICAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnY2xlYW4nOlxuICAgICAgICAgICAgdGhpcy5jbGVhblNpbmdsZShpdGVtLmlkISk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ3NldCc6XG4gICAgICAgICAgICBpZiAoaXRlbS5hZGQpIHtcbiAgICAgICAgICAgICAgdGhpcy5hZGQoaXRlbS5ub3RpZmljYXRpb24hKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEJlaGF2aW9yKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0QmVoYXZpb3IoaXRlbSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoISh0aGlzLmNkIGFzIFZpZXdSZWYpLmRlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmxpc3RlbmVyKSB7XG4gICAgICB0aGlzLmxpc3RlbmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuY2QuZGV0YWNoKCk7XG4gIH1cblxuICAvLyBEZWZhdWx0IGJlaGF2aW9yIG9uIGV2ZW50XG4gIGRlZmF1bHRCZWhhdmlvcih2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSh0aGlzLm5vdGlmaWNhdGlvbnMuaW5kZXhPZih2YWx1ZS5ub3RpZmljYXRpb24pLCAxKTtcbiAgICB0aGlzLmRlc3Ryb3kuZW1pdCh0aGlzLmJ1aWxkRW1pdCh2YWx1ZS5ub3RpZmljYXRpb24sIGZhbHNlKSk7XG4gIH1cblxuXG4gIC8vIEFkZCB0aGUgbmV3IG5vdGlmaWNhdGlvbiB0byB0aGUgbm90aWZpY2F0aW9uIGFycmF5XG4gIGFkZChpdGVtOiBOb3RpZmljYXRpb24pOiB2b2lkIHtcbiAgICBpdGVtLmNyZWF0ZWRPbiA9IG5ldyBEYXRlKCk7XG5cbiAgICBjb25zdCB0b0Jsb2NrOiBib29sZWFuID0gdGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMgfHwgdGhpcy5wcmV2ZW50RHVwbGljYXRlcyA/IHRoaXMuYmxvY2soaXRlbSkgOiBmYWxzZTtcblxuICAgIC8vIFNhdmUgdGhpcyBhcyB0aGUgbGFzdCBjcmVhdGVkIG5vdGlmaWNhdGlvblxuICAgIHRoaXMubGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQgPSBpdGVtO1xuICAgIC8vIE92ZXJyaWRlIGljb24gaWYgc2V0XG4gICAgaWYgKGl0ZW0ub3ZlcnJpZGUgJiYgaXRlbS5vdmVycmlkZS5pY29ucyAmJiBpdGVtLm92ZXJyaWRlLmljb25zW2l0ZW0udHlwZV0pIHtcbiAgICAgIGl0ZW0uaWNvbiA9IGl0ZW0ub3ZlcnJpZGUuaWNvbnNbaXRlbS50eXBlXTtcbiAgICB9XG5cbiAgICBpZiAoIXRvQmxvY2spIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZSBub3RpZmljYXRpb24gc2hvdWxkIGJlIGFkZGVkIGF0IHRoZSBzdGFydCBvciB0aGUgZW5kIG9mIHRoZSBhcnJheVxuICAgICAgaWYgKHRoaXMubGFzdE9uQm90dG9tKSB7XG4gICAgICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID49IHRoaXMubWF4U3RhY2spIHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKDAsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnB1c2goaXRlbSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+PSB0aGlzLm1heFN0YWNrKSB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSh0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoIC0gMSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKDAsIDAsIGl0ZW0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNyZWF0ZS5lbWl0KHRoaXMuYnVpbGRFbWl0KGl0ZW0sIHRydWUpKTtcbiAgICB9XG4gIH1cblxuICAvLyBDaGVjayBpZiBub3RpZmljYXRpb25zIHNob3VsZCBiZSBwcmV2ZW50ZWRcbiAgYmxvY2soaXRlbTogTm90aWZpY2F0aW9uKTogYm9vbGVhbiB7XG5cbiAgICBjb25zdCB0b0NoZWNrID0gaXRlbS5odG1sID8gdGhpcy5jaGVja0h0bWwgOiB0aGlzLmNoZWNrU3RhbmRhcmQ7XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50RHVwbGljYXRlcyAmJiB0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChjb25zdCBub3RpZmljYXRpb24gb2YgdGhpcy5ub3RpZmljYXRpb25zKSB7XG4gICAgICAgIGlmICh0b0NoZWNrKG5vdGlmaWNhdGlvbiwgaXRlbSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcykge1xuXG4gICAgICBsZXQgY29tcDogTm90aWZpY2F0aW9uO1xuXG4gICAgICBpZiAodGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMgPT09ICd2aXNpYmxlJyAmJiB0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodGhpcy5sYXN0T25Cb3R0b20pIHtcbiAgICAgICAgICBjb21wID0gdGhpcy5ub3RpZmljYXRpb25zW3RoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggLSAxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb21wID0gdGhpcy5ub3RpZmljYXRpb25zWzBdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzID09PSAnYWxsJyAmJiB0aGlzLmxhc3ROb3RpZmljYXRpb25DcmVhdGVkKSB7XG4gICAgICAgIGNvbXAgPSB0aGlzLmxhc3ROb3RpZmljYXRpb25DcmVhdGVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRvQ2hlY2soY29tcCwgaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2hlY2tTdGFuZGFyZChjaGVja2VyOiBOb3RpZmljYXRpb24sIGl0ZW06IE5vdGlmaWNhdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjaGVja2VyLnR5cGUgPT09IGl0ZW0udHlwZSAmJiBjaGVja2VyLnRpdGxlID09PSBpdGVtLnRpdGxlICYmIGNoZWNrZXIuY29udGVudCA9PT0gaXRlbS5jb250ZW50O1xuICB9XG5cbiAgY2hlY2tIdG1sKGNoZWNrZXI6IE5vdGlmaWNhdGlvbiwgaXRlbTogTm90aWZpY2F0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNoZWNrZXIuaHRtbCA/XG4gICAgICBjaGVja2VyLnR5cGUgPT09IGl0ZW0udHlwZSAmJiBjaGVja2VyLnRpdGxlID09PSBpdGVtLnRpdGxlICYmIGNoZWNrZXIuY29udGVudCA9PT0gaXRlbS5jb250ZW50ICYmIGNoZWNrZXIuaHRtbCA9PT0gaXRlbS5odG1sIDpcbiAgICAgIGZhbHNlO1xuICB9XG5cbiAgLy8gQXR0YWNoIGFsbCB0aGUgY2hhbmdlcyByZWNlaXZlZCBpbiB0aGUgb3B0aW9ucyBvYmplY3RcbiAgYXR0YWNoQ2hhbmdlcyhvcHRpb25zOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICh0aGlzIGFzIGFueSlba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnaWNvbnMnKSB7XG4gICAgICAgIHRoaXMuc2VydmljZS5pY29ucyA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBidWlsZEVtaXQobm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb24sIHRvOiBib29sZWFuKSB7XG4gICAgY29uc3QgdG9FbWl0OiBOb3RpZmljYXRpb24gPSB7XG4gICAgICBjcmVhdGVkT246IG5vdGlmaWNhdGlvbi5jcmVhdGVkT24sXG4gICAgICB0eXBlOiBub3RpZmljYXRpb24udHlwZSxcbiAgICAgIGljb246IG5vdGlmaWNhdGlvbi5pY29uLFxuICAgICAgaWQ6IG5vdGlmaWNhdGlvbi5pZFxuICAgIH07XG5cbiAgICBpZiAobm90aWZpY2F0aW9uLmh0bWwpIHtcbiAgICAgIHRvRW1pdC5odG1sID0gbm90aWZpY2F0aW9uLmh0bWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRvRW1pdC50aXRsZSA9IG5vdGlmaWNhdGlvbi50aXRsZTtcbiAgICAgIHRvRW1pdC5jb250ZW50ID0gbm90aWZpY2F0aW9uLmNvbnRlbnQ7XG4gICAgfVxuXG4gICAgaWYgKCF0bykge1xuICAgICAgdG9FbWl0LmRlc3Ryb3llZE9uID0gbmV3IERhdGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9FbWl0O1xuICB9XG5cbiAgY2xlYW5TaW5nbGUoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGxldCBpbmRleE9mRGVsZXRlID0gMDtcbiAgICBsZXQgZG9EZWxldGUgPSBmYWxzZTtcbiAgICBsZXQgbm90aTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9ucy5mb3JFYWNoKChub3RpZmljYXRpb24sIGlkeCkgPT4ge1xuICAgICAgaWYgKG5vdGlmaWNhdGlvbi5pZCA9PT0gaWQpIHtcbiAgICAgICAgaW5kZXhPZkRlbGV0ZSA9IGlkeDtcbiAgICAgICAgbm90aSA9IG5vdGlmaWNhdGlvbjtcbiAgICAgICAgZG9EZWxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGRvRGVsZXRlKSB7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKGluZGV4T2ZEZWxldGUsIDEpO1xuICAgICAgdGhpcy5kZXN0cm95LmVtaXQodGhpcy5idWlsZEVtaXQobm90aSwgZmFsc2UpKTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJzaW1wbGUtbm90aWZpY2F0aW9uLXdyYXBwZXJcIiBbbmdDbGFzc109XCJwb3NpdGlvblwiPlxuICAgIDxzaW1wbGUtbm90aWZpY2F0aW9uXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgYSBvZiBub3RpZmljYXRpb25zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICAgIFtpdGVtXT1cImFcIlxuICAgICAgICAgICAgW3RpbWVPdXRdPVwidGltZU91dFwiXG4gICAgICAgICAgICBbY2xpY2tUb0Nsb3NlXT1cImNsaWNrVG9DbG9zZVwiXG4gICAgICAgICAgICBbY2xpY2tJY29uVG9DbG9zZV09XCJjbGlja0ljb25Ub0Nsb3NlXCJcbiAgICAgICAgICAgIFttYXhMZW5ndGhdPVwibWF4TGVuZ3RoXCJcbiAgICAgICAgICAgIFtzaG93UHJvZ3Jlc3NCYXJdPVwic2hvd1Byb2dyZXNzQmFyXCJcbiAgICAgICAgICAgIFtwYXVzZU9uSG92ZXJdPVwicGF1c2VPbkhvdmVyXCJcbiAgICAgICAgICAgIFt0aGVDbGFzc109XCJ0aGVDbGFzc1wiXG4gICAgICAgICAgICBbcnRsXT1cInJ0bFwiXG4gICAgICAgICAgICBbYW5pbWF0ZV09XCJhbmltYXRlXCJcbiAgICAgICAgICAgIFtwb3NpdGlvbl09XCJpXCI+XG4gICAgPC9zaW1wbGUtbm90aWZpY2F0aW9uPlxuPC9kaXY+Il19