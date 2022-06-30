import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NotificationAnimationType } from '../../enums/notification-animation-type.enum';
import * as i0 from "@angular/core";
import * as i1 from "../../services/notifications.service";
import * as i2 from "../notification/notification.component";
import * as i3 from "@angular/common";
export class SimpleNotificationsComponent {
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
}
SimpleNotificationsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsComponent, deps: [{ token: i1.NotificationsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
SimpleNotificationsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "12.2.16", type: SimpleNotificationsComponent, selector: "simple-notifications", inputs: { options: "options" }, outputs: { create: "create", destroy: "destroy" }, ngImport: i0, template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>", styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"], components: [{ type: i2.NotificationComponent, selector: "simple-notification", inputs: ["timeOut", "showProgressBar", "pauseOnHover", "clickToClose", "clickIconToClose", "maxLength", "theClass", "rtl", "animate", "position", "item"] }], directives: [{ type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'simple-notifications',
                    encapsulation: ViewEncapsulation.None,
                    templateUrl: './simple-notifications.component.html',
                    styleUrls: ['./simple-notifications.component.css'],
                    changeDetection: ChangeDetectionStrategy.OnPush
                }]
        }], ctorParameters: function () { return [{ type: i1.NotificationsService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { options: [{
                type: Input
            }], create: [{
                type: Output
            }], destroy: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3NpbXBsZS1ub3RpZmljYXRpb25zL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9zaW1wbGUtbm90aWZpY2F0aW9ucy9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxpQkFBaUIsRUFBOEIsTUFBTSxlQUFlLENBQUM7QUFFbEssT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7O0FBWXpGLE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsWUFDVSxPQUE2QixFQUM3QixFQUFxQjtRQURyQixZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVFyQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2QyxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsYUFBUSxHQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBS3pDLGtCQUFrQjtRQUNWLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYiwwQkFBcUIsR0FBUSxLQUFLLENBQUM7UUFDbkMsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBRWxDLGNBQWM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLGlCQUFZLEdBQUcsSUFBSSxDQUFD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O2dCQUNHLE9BQU87c0JBQWhCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIFZpZXdSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZSB9IGZyb20gJy4uLy4uL2VudW1zL25vdGlmaWNhdGlvbi1hbmltYXRpb24tdHlwZS5lbnVtJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm90aWZpY2F0aW9uLnR5cGUnO1xuaW1wb3J0IHsgT3B0aW9ucywgUG9zaXRpb24gfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL29wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vdGlmaWNhdGlvbnMuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3NpbXBsZS1ub3RpZmljYXRpb25zJyxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmNzcyddLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBTaW1wbGVOb3RpZmljYXRpb25zQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHNlcnZpY2U6IE5vdGlmaWNhdGlvbnNTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmXG4gICkgeyB9XG5cbiAgQElucHV0KCkgc2V0IG9wdGlvbnMob3B0OiBPcHRpb25zKSB7XG4gICAgdGhpcy51c2luZ0NvbXBvbmVudE9wdGlvbnMgPSB0cnVlO1xuICAgIHRoaXMuYXR0YWNoQ2hhbmdlcyhvcHQpO1xuICB9XG5cbiAgQE91dHB1dCgpIGNyZWF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQE91dHB1dCgpIGRlc3Ryb3kgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgbm90aWZpY2F0aW9uczogTm90aWZpY2F0aW9uW10gPSBbXTtcbiAgcG9zaXRpb246IFBvc2l0aW9uID0gWydib3R0b20nLCAncmlnaHQnXTtcblxuICBwcml2YXRlIGxhc3ROb3RpZmljYXRpb25DcmVhdGVkOiBOb3RpZmljYXRpb247XG4gIHByaXZhdGUgbGlzdGVuZXI6IFN1YnNjcmlwdGlvbjtcblxuICAvLyBSZWNlaXZlZCB2YWx1ZXNcbiAgcHJpdmF0ZSBsYXN0T25Cb3R0b20gPSB0cnVlO1xuICBwcml2YXRlIG1heFN0YWNrID0gODtcbiAgcHJpdmF0ZSBwcmV2ZW50TGFzdER1cGxpY2F0ZXM6IGFueSA9IGZhbHNlO1xuICBwcml2YXRlIHByZXZlbnREdXBsaWNhdGVzID0gZmFsc2U7XG5cbiAgLy8gU2VudCB2YWx1ZXNcbiAgdGltZU91dCA9IDA7XG4gIG1heExlbmd0aCA9IDA7XG4gIGNsaWNrVG9DbG9zZSA9IHRydWU7XG4gIGNsaWNrSWNvblRvQ2xvc2UgPSBmYWxzZTtcbiAgc2hvd1Byb2dyZXNzQmFyID0gdHJ1ZTtcbiAgcGF1c2VPbkhvdmVyID0gdHJ1ZTtcbiAgdGhlQ2xhc3MgPSAnJztcbiAgcnRsID0gZmFsc2U7XG4gIGFuaW1hdGU6IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUgPSBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlLkZyb21SaWdodDtcblxuICBwcml2YXRlIHVzaW5nQ29tcG9uZW50T3B0aW9ucyA9IGZhbHNlO1xuXG4gIG5nT25Jbml0KCkge1xuXG4gICAgLyoqXG4gICAgICogT25seSBhdHRhY2ggZ2xvYmFsIG9wdGlvbnMgaWYgY29uZmlnXG4gICAgICogb3B0aW9ucyB3ZXJlIG5ldmVyIHNlbnQgdGhyb3VnaCBpbnB1dFxuICAgICAqL1xuICAgIGlmICghdGhpcy51c2luZ0NvbXBvbmVudE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYXR0YWNoQ2hhbmdlcyhcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmdsb2JhbE9wdGlvbnNcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5saXN0ZW5lciA9IHRoaXMuc2VydmljZS5lbWl0dGVyXG4gICAgICAuc3Vic2NyaWJlKGl0ZW0gPT4ge1xuICAgICAgICBzd2l0Y2ggKGl0ZW0uY29tbWFuZCkge1xuICAgICAgICAgIGNhc2UgJ2NsZWFuQWxsJzpcbiAgICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IFtdO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdjbGVhbic6XG4gICAgICAgICAgICB0aGlzLmNsZWFuU2luZ2xlKGl0ZW0uaWQhKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnc2V0JzpcbiAgICAgICAgICAgIGlmIChpdGVtLmFkZCkge1xuICAgICAgICAgICAgICB0aGlzLmFkZChpdGVtLm5vdGlmaWNhdGlvbiEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0QmVoYXZpb3IoaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRCZWhhdmlvcihpdGVtKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHRoaXMuY2QgYXMgVmlld1JlZikuZGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIpIHtcbiAgICAgIHRoaXMubGlzdGVuZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5jZC5kZXRhY2goKTtcbiAgfVxuXG4gIC8vIERlZmF1bHQgYmVoYXZpb3Igb24gZXZlbnRcbiAgZGVmYXVsdEJlaGF2aW9yKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKHRoaXMubm90aWZpY2F0aW9ucy5pbmRleE9mKHZhbHVlLm5vdGlmaWNhdGlvbiksIDEpO1xuICAgIHRoaXMuZGVzdHJveS5lbWl0KHRoaXMuYnVpbGRFbWl0KHZhbHVlLm5vdGlmaWNhdGlvbiwgZmFsc2UpKTtcbiAgfVxuXG5cbiAgLy8gQWRkIHRoZSBuZXcgbm90aWZpY2F0aW9uIHRvIHRoZSBub3RpZmljYXRpb24gYXJyYXlcbiAgYWRkKGl0ZW06IE5vdGlmaWNhdGlvbik6IHZvaWQge1xuICAgIGl0ZW0uY3JlYXRlZE9uID0gbmV3IERhdGUoKTtcblxuICAgIGNvbnN0IHRvQmxvY2s6IGJvb2xlYW4gPSB0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyB8fCB0aGlzLnByZXZlbnREdXBsaWNhdGVzID8gdGhpcy5ibG9jayhpdGVtKSA6IGZhbHNlO1xuXG4gICAgLy8gU2F2ZSB0aGlzIGFzIHRoZSBsYXN0IGNyZWF0ZWQgbm90aWZpY2F0aW9uXG4gICAgdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZCA9IGl0ZW07XG4gICAgLy8gT3ZlcnJpZGUgaWNvbiBpZiBzZXRcbiAgICBpZiAoaXRlbS5vdmVycmlkZSAmJiBpdGVtLm92ZXJyaWRlLmljb25zICYmIGl0ZW0ub3ZlcnJpZGUuaWNvbnNbaXRlbS50eXBlXSkge1xuICAgICAgaXRlbS5pY29uID0gaXRlbS5vdmVycmlkZS5pY29uc1tpdGVtLnR5cGVdO1xuICAgIH1cblxuICAgIGlmICghdG9CbG9jaykge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIG5vdGlmaWNhdGlvbiBzaG91bGQgYmUgYWRkZWQgYXQgdGhlIHN0YXJ0IG9yIHRoZSBlbmQgb2YgdGhlIGFycmF5XG4gICAgICBpZiAodGhpcy5sYXN0T25Cb3R0b20pIHtcbiAgICAgICAgaWYgKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPj0gdGhpcy5tYXhTdGFjaykge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoMCwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMucHVzaChpdGVtKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoID49IHRoaXMubWF4U3RhY2spIHtcbiAgICAgICAgICB0aGlzLm5vdGlmaWNhdGlvbnMuc3BsaWNlKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggLSAxLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoMCwgMCwgaXRlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3JlYXRlLmVtaXQodGhpcy5idWlsZEVtaXQoaXRlbSwgdHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIC8vIENoZWNrIGlmIG5vdGlmaWNhdGlvbnMgc2hvdWxkIGJlIHByZXZlbnRlZFxuICBibG9jayhpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcblxuICAgIGNvbnN0IHRvQ2hlY2sgPSBpdGVtLmh0bWwgPyB0aGlzLmNoZWNrSHRtbCA6IHRoaXMuY2hlY2tTdGFuZGFyZDtcblxuICAgIGlmICh0aGlzLnByZXZlbnREdXBsaWNhdGVzICYmIHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBmb3IgKGNvbnN0IG5vdGlmaWNhdGlvbiBvZiB0aGlzLm5vdGlmaWNhdGlvbnMpIHtcbiAgICAgICAgaWYgKHRvQ2hlY2sobm90aWZpY2F0aW9uLCBpdGVtKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzKSB7XG5cbiAgICAgIGxldCBjb21wOiBOb3RpZmljYXRpb247XG5cbiAgICAgIGlmICh0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyA9PT0gJ3Zpc2libGUnICYmIHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RPbkJvdHRvbSkge1xuICAgICAgICAgIGNvbXAgPSB0aGlzLm5vdGlmaWNhdGlvbnNbdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbXAgPSB0aGlzLm5vdGlmaWNhdGlvbnNbMF07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMgPT09ICdhbGwnICYmIHRoaXMubGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQpIHtcbiAgICAgICAgY29tcCA9IHRoaXMubGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9DaGVjayhjb21wLCBpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjaGVja1N0YW5kYXJkKGNoZWNrZXI6IE5vdGlmaWNhdGlvbiwgaXRlbTogTm90aWZpY2F0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNoZWNrZXIudHlwZSA9PT0gaXRlbS50eXBlICYmIGNoZWNrZXIudGl0bGUgPT09IGl0ZW0udGl0bGUgJiYgY2hlY2tlci5jb250ZW50ID09PSBpdGVtLmNvbnRlbnQ7XG4gIH1cblxuICBjaGVja0h0bWwoY2hlY2tlcjogTm90aWZpY2F0aW9uLCBpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hlY2tlci5odG1sID9cbiAgICAgIGNoZWNrZXIudHlwZSA9PT0gaXRlbS50eXBlICYmIGNoZWNrZXIudGl0bGUgPT09IGl0ZW0udGl0bGUgJiYgY2hlY2tlci5jb250ZW50ID09PSBpdGVtLmNvbnRlbnQgJiYgY2hlY2tlci5odG1sID09PSBpdGVtLmh0bWwgOlxuICAgICAgZmFsc2U7XG4gIH1cblxuICAvLyBBdHRhY2ggYWxsIHRoZSBjaGFuZ2VzIHJlY2VpdmVkIGluIHRoZSBvcHRpb25zIG9iamVjdFxuICBhdHRhY2hDaGFuZ2VzKG9wdGlvbnM6IGFueSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtrZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdpY29ucycpIHtcbiAgICAgICAgdGhpcy5zZXJ2aWNlLmljb25zID0gb3B0aW9uc1trZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGJ1aWxkRW1pdChub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbiwgdG86IGJvb2xlYW4pIHtcbiAgICBjb25zdCB0b0VtaXQ6IE5vdGlmaWNhdGlvbiA9IHtcbiAgICAgIGNyZWF0ZWRPbjogbm90aWZpY2F0aW9uLmNyZWF0ZWRPbixcbiAgICAgIHR5cGU6IG5vdGlmaWNhdGlvbi50eXBlLFxuICAgICAgaWNvbjogbm90aWZpY2F0aW9uLmljb24sXG4gICAgICBpZDogbm90aWZpY2F0aW9uLmlkXG4gICAgfTtcblxuICAgIGlmIChub3RpZmljYXRpb24uaHRtbCkge1xuICAgICAgdG9FbWl0Lmh0bWwgPSBub3RpZmljYXRpb24uaHRtbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9FbWl0LnRpdGxlID0gbm90aWZpY2F0aW9uLnRpdGxlO1xuICAgICAgdG9FbWl0LmNvbnRlbnQgPSBub3RpZmljYXRpb24uY29udGVudDtcbiAgICB9XG5cbiAgICBpZiAoIXRvKSB7XG4gICAgICB0b0VtaXQuZGVzdHJveWVkT24gPSBuZXcgRGF0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiB0b0VtaXQ7XG4gIH1cblxuICBjbGVhblNpbmdsZShpZDogc3RyaW5nKTogdm9pZCB7XG4gICAgbGV0IGluZGV4T2ZEZWxldGUgPSAwO1xuICAgIGxldCBkb0RlbGV0ZSA9IGZhbHNlO1xuICAgIGxldCBub3RpO1xuXG4gICAgdGhpcy5ub3RpZmljYXRpb25zLmZvckVhY2goKG5vdGlmaWNhdGlvbiwgaWR4KSA9PiB7XG4gICAgICBpZiAobm90aWZpY2F0aW9uLmlkID09PSBpZCkge1xuICAgICAgICBpbmRleE9mRGVsZXRlID0gaWR4O1xuICAgICAgICBub3RpID0gbm90aWZpY2F0aW9uO1xuICAgICAgICBkb0RlbGV0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoZG9EZWxldGUpIHtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UoaW5kZXhPZkRlbGV0ZSwgMSk7XG4gICAgICB0aGlzLmRlc3Ryb3kuZW1pdCh0aGlzLmJ1aWxkRW1pdChub3RpLCBmYWxzZSkpO1xuICAgIH1cbiAgfVxufVxuIiwiPGRpdiBjbGFzcz1cInNpbXBsZS1ub3RpZmljYXRpb24td3JhcHBlclwiIFtuZ0NsYXNzXT1cInBvc2l0aW9uXCI+XG4gICAgPHNpbXBsZS1ub3RpZmljYXRpb25cbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBhIG9mIG5vdGlmaWNhdGlvbnM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICAgICAgW2l0ZW1dPVwiYVwiXG4gICAgICAgICAgICBbdGltZU91dF09XCJ0aW1lT3V0XCJcbiAgICAgICAgICAgIFtjbGlja1RvQ2xvc2VdPVwiY2xpY2tUb0Nsb3NlXCJcbiAgICAgICAgICAgIFtjbGlja0ljb25Ub0Nsb3NlXT1cImNsaWNrSWNvblRvQ2xvc2VcIlxuICAgICAgICAgICAgW21heExlbmd0aF09XCJtYXhMZW5ndGhcIlxuICAgICAgICAgICAgW3Nob3dQcm9ncmVzc0Jhcl09XCJzaG93UHJvZ3Jlc3NCYXJcIlxuICAgICAgICAgICAgW3BhdXNlT25Ib3Zlcl09XCJwYXVzZU9uSG92ZXJcIlxuICAgICAgICAgICAgW3RoZUNsYXNzXT1cInRoZUNsYXNzXCJcbiAgICAgICAgICAgIFtydGxdPVwicnRsXCJcbiAgICAgICAgICAgIFthbmltYXRlXT1cImFuaW1hdGVcIlxuICAgICAgICAgICAgW3Bvc2l0aW9uXT1cImlcIj5cbiAgICA8L3NpbXBsZS1ub3RpZmljYXRpb24+XG48L2Rpdj4iXX0=