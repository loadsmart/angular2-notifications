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
SimpleNotificationsComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsComponent, deps: [{ token: i1.NotificationsService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
SimpleNotificationsComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.11", type: SimpleNotificationsComponent, selector: "simple-notifications", inputs: { options: "options" }, outputs: { create: "create", destroy: "destroy" }, ngImport: i0, template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>", styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"], components: [{ type: i2.NotificationComponent, selector: "simple-notification", inputs: ["timeOut", "showProgressBar", "pauseOnHover", "clickToClose", "clickIconToClose", "maxLength", "theClass", "rtl", "animate", "position", "item"] }], directives: [{ type: i3.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'simple-notifications', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"simple-notification-wrapper\" [ngClass]=\"position\">\n    <simple-notification\n            *ngFor=\"let a of notifications; let i = index\"\n            [item]=\"a\"\n            [timeOut]=\"timeOut\"\n            [clickToClose]=\"clickToClose\"\n            [clickIconToClose]=\"clickIconToClose\"\n            [maxLength]=\"maxLength\"\n            [showProgressBar]=\"showProgressBar\"\n            [pauseOnHover]=\"pauseOnHover\"\n            [theClass]=\"theClass\"\n            [rtl]=\"rtl\"\n            [animate]=\"animate\"\n            [position]=\"i\">\n    </simple-notification>\n</div>", styles: [".simple-notification-wrapper{position:fixed;width:300px;z-index:1000}.simple-notification-wrapper.left{left:20px}.simple-notification-wrapper.top{top:20px}.simple-notification-wrapper.right{right:20px}.simple-notification-wrapper.bottom{bottom:20px}.simple-notification-wrapper.center{left:50%;transform:translate(-50%)}.simple-notification-wrapper.middle{top:50%;transform:translateY(-50%)}.simple-notification-wrapper.middle.center{transform:translate(-50%,-50%)}@media (max-width: 340px){.simple-notification-wrapper{width:auto;left:20px;right:20px}}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.NotificationsService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { options: [{
                type: Input
            }], create: [{
                type: Output
            }], destroy: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3NpbXBsZS1ub3RpZmljYXRpb25zL3NpbXBsZS1ub3RpZmljYXRpb25zLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9zaW1wbGUtbm90aWZpY2F0aW9ucy9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxpQkFBaUIsRUFBOEIsTUFBTSxlQUFlLENBQUM7QUFFbEssT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7O0FBWXpGLE1BQU0sT0FBTyw0QkFBNEI7SUFDdkMsWUFDVSxPQUE2QixFQUM3QixFQUFxQjtRQURyQixZQUFPLEdBQVAsT0FBTyxDQUFzQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQVFyQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV2QyxrQkFBYSxHQUFtQixFQUFFLENBQUM7UUFDbkMsYUFBUSxHQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBS3pDLGtCQUFrQjtRQUNWLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFDYiwwQkFBcUIsR0FBUSxLQUFLLENBQUM7UUFDbkMsc0JBQWlCLEdBQUcsS0FBSyxDQUFDO1FBRWxDLGNBQWM7UUFDZCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osY0FBUyxHQUFHLENBQUMsQ0FBQztRQUNkLGlCQUFZLEdBQUcsSUFBSSxDQUFD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Q0FBQyxPQUFPLENBQUM7U0FDdkM7UUFFRCxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsTUFBTSxDQUFDLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFVO1FBQ3BCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUM7UUFFVCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMvQyxJQUFJLFlBQVksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMxQixhQUFhLEdBQUcsR0FBRyxDQUFDO2dCQUNwQixJQUFJLEdBQUcsWUFBWSxDQUFDO2dCQUNwQixRQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ2pCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQzs7MEhBN05VLDRCQUE0Qjs4R0FBNUIsNEJBQTRCLCtJQ2R6Qyx3bUJBZU07NEZERE8sNEJBQTRCO2tCQVB4QyxTQUFTOytCQUNFLHNCQUFzQixpQkFDakIsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsTUFBTTsySUFRbEMsT0FBTztzQkFBbkIsS0FBSztnQkFLSSxNQUFNO3NCQUFmLE1BQU07Z0JBQ0csT0FBTztzQkFBaEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9uLCBDaGFuZ2VEZXRlY3RvclJlZiwgVmlld1JlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25BbmltYXRpb25UeXBlIH0gZnJvbSAnLi4vLi4vZW51bXMvbm90aWZpY2F0aW9uLWFuaW1hdGlvbi10eXBlLmVudW0nO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub3RpZmljYXRpb24udHlwZSc7XG5pbXBvcnQgeyBPcHRpb25zLCBQb3NpdGlvbiB9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnc2ltcGxlLW5vdGlmaWNhdGlvbnMnLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZVVybDogJy4vc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQuY3NzJ10sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXG59KVxuZXhwb3J0IGNsYXNzIFNpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc2VydmljZTogTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7IH1cblxuICBASW5wdXQoKSBzZXQgb3B0aW9ucyhvcHQ6IE9wdGlvbnMpIHtcbiAgICB0aGlzLnVzaW5nQ29tcG9uZW50T3B0aW9ucyA9IHRydWU7XG4gICAgdGhpcy5hdHRhY2hDaGFuZ2VzKG9wdCk7XG4gIH1cblxuICBAT3V0cHV0KCkgY3JlYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBub3RpZmljYXRpb25zOiBOb3RpZmljYXRpb25bXSA9IFtdO1xuICBwb3NpdGlvbjogUG9zaXRpb24gPSBbJ2JvdHRvbScsICdyaWdodCddO1xuXG4gIHByaXZhdGUgbGFzdE5vdGlmaWNhdGlvbkNyZWF0ZWQ6IE5vdGlmaWNhdGlvbjtcbiAgcHJpdmF0ZSBsaXN0ZW5lcjogU3Vic2NyaXB0aW9uO1xuXG4gIC8vIFJlY2VpdmVkIHZhbHVlc1xuICBwcml2YXRlIGxhc3RPbkJvdHRvbSA9IHRydWU7XG4gIHByaXZhdGUgbWF4U3RhY2sgPSA4O1xuICBwcml2YXRlIHByZXZlbnRMYXN0RHVwbGljYXRlczogYW55ID0gZmFsc2U7XG4gIHByaXZhdGUgcHJldmVudER1cGxpY2F0ZXMgPSBmYWxzZTtcblxuICAvLyBTZW50IHZhbHVlc1xuICB0aW1lT3V0ID0gMDtcbiAgbWF4TGVuZ3RoID0gMDtcbiAgY2xpY2tUb0Nsb3NlID0gdHJ1ZTtcbiAgY2xpY2tJY29uVG9DbG9zZSA9IGZhbHNlO1xuICBzaG93UHJvZ3Jlc3NCYXIgPSB0cnVlO1xuICBwYXVzZU9uSG92ZXIgPSB0cnVlO1xuICB0aGVDbGFzcyA9ICcnO1xuICBydGwgPSBmYWxzZTtcbiAgYW5pbWF0ZTogTm90aWZpY2F0aW9uQW5pbWF0aW9uVHlwZSA9IE5vdGlmaWNhdGlvbkFuaW1hdGlvblR5cGUuRnJvbVJpZ2h0O1xuXG4gIHByaXZhdGUgdXNpbmdDb21wb25lbnRPcHRpb25zID0gZmFsc2U7XG5cbiAgbmdPbkluaXQoKSB7XG5cbiAgICAvKipcbiAgICAgKiBPbmx5IGF0dGFjaCBnbG9iYWwgb3B0aW9ucyBpZiBjb25maWdcbiAgICAgKiBvcHRpb25zIHdlcmUgbmV2ZXIgc2VudCB0aHJvdWdoIGlucHV0XG4gICAgICovXG4gICAgaWYgKCF0aGlzLnVzaW5nQ29tcG9uZW50T3B0aW9ucykge1xuICAgICAgdGhpcy5hdHRhY2hDaGFuZ2VzKFxuICAgICAgICB0aGlzLnNlcnZpY2UuZ2xvYmFsT3B0aW9uc1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmxpc3RlbmVyID0gdGhpcy5zZXJ2aWNlLmVtaXR0ZXJcbiAgICAgIC5zdWJzY3JpYmUoaXRlbSA9PiB7XG4gICAgICAgIHN3aXRjaCAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgY2FzZSAnY2xlYW5BbGwnOlxuICAgICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gW107XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2NsZWFuJzpcbiAgICAgICAgICAgIHRoaXMuY2xlYW5TaW5nbGUoaXRlbS5pZCEpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzZXQnOlxuICAgICAgICAgICAgaWYgKGl0ZW0uYWRkKSB7XG4gICAgICAgICAgICAgIHRoaXMuYWRkKGl0ZW0ubm90aWZpY2F0aW9uISk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmRlZmF1bHRCZWhhdmlvcihpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdEJlaGF2aW9yKGl0ZW0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEodGhpcy5jZCBhcyBWaWV3UmVmKS5kZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5saXN0ZW5lcikge1xuICAgICAgdGhpcy5saXN0ZW5lci51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLmNkLmRldGFjaCgpO1xuICB9XG5cbiAgLy8gRGVmYXVsdCBiZWhhdmlvciBvbiBldmVudFxuICBkZWZhdWx0QmVoYXZpb3IodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UodGhpcy5ub3RpZmljYXRpb25zLmluZGV4T2YodmFsdWUubm90aWZpY2F0aW9uKSwgMSk7XG4gICAgdGhpcy5kZXN0cm95LmVtaXQodGhpcy5idWlsZEVtaXQodmFsdWUubm90aWZpY2F0aW9uLCBmYWxzZSkpO1xuICB9XG5cblxuICAvLyBBZGQgdGhlIG5ldyBub3RpZmljYXRpb24gdG8gdGhlIG5vdGlmaWNhdGlvbiBhcnJheVxuICBhZGQoaXRlbTogTm90aWZpY2F0aW9uKTogdm9pZCB7XG4gICAgaXRlbS5jcmVhdGVkT24gPSBuZXcgRGF0ZSgpO1xuXG4gICAgY29uc3QgdG9CbG9jazogYm9vbGVhbiA9IHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzIHx8IHRoaXMucHJldmVudER1cGxpY2F0ZXMgPyB0aGlzLmJsb2NrKGl0ZW0pIDogZmFsc2U7XG5cbiAgICAvLyBTYXZlIHRoaXMgYXMgdGhlIGxhc3QgY3JlYXRlZCBub3RpZmljYXRpb25cbiAgICB0aGlzLmxhc3ROb3RpZmljYXRpb25DcmVhdGVkID0gaXRlbTtcbiAgICAvLyBPdmVycmlkZSBpY29uIGlmIHNldFxuICAgIGlmIChpdGVtLm92ZXJyaWRlICYmIGl0ZW0ub3ZlcnJpZGUuaWNvbnMgJiYgaXRlbS5vdmVycmlkZS5pY29uc1tpdGVtLnR5cGVdKSB7XG4gICAgICBpdGVtLmljb24gPSBpdGVtLm92ZXJyaWRlLmljb25zW2l0ZW0udHlwZV07XG4gICAgfVxuXG4gICAgaWYgKCF0b0Jsb2NrKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgbm90aWZpY2F0aW9uIHNob3VsZCBiZSBhZGRlZCBhdCB0aGUgc3RhcnQgb3IgdGhlIGVuZCBvZiB0aGUgYXJyYXlcbiAgICAgIGlmICh0aGlzLmxhc3RPbkJvdHRvbSkge1xuICAgICAgICBpZiAodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+PSB0aGlzLm1heFN0YWNrKSB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSgwLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5wdXNoKGl0ZW0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPj0gdGhpcy5tYXhTdGFjaykge1xuICAgICAgICAgIHRoaXMubm90aWZpY2F0aW9ucy5zcGxpY2UodGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZSgwLCAwLCBpdGVtKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jcmVhdGUuZW1pdCh0aGlzLmJ1aWxkRW1pdChpdGVtLCB0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gQ2hlY2sgaWYgbm90aWZpY2F0aW9ucyBzaG91bGQgYmUgcHJldmVudGVkXG4gIGJsb2NrKGl0ZW06IE5vdGlmaWNhdGlvbik6IGJvb2xlYW4ge1xuXG4gICAgY29uc3QgdG9DaGVjayA9IGl0ZW0uaHRtbCA/IHRoaXMuY2hlY2tIdG1sIDogdGhpcy5jaGVja1N0YW5kYXJkO1xuXG4gICAgaWYgKHRoaXMucHJldmVudER1cGxpY2F0ZXMgJiYgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGZvciAoY29uc3Qgbm90aWZpY2F0aW9uIG9mIHRoaXMubm90aWZpY2F0aW9ucykge1xuICAgICAgICBpZiAodG9DaGVjayhub3RpZmljYXRpb24sIGl0ZW0pKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50TGFzdER1cGxpY2F0ZXMpIHtcblxuICAgICAgbGV0IGNvbXA6IE5vdGlmaWNhdGlvbjtcblxuICAgICAgaWYgKHRoaXMucHJldmVudExhc3REdXBsaWNhdGVzID09PSAndmlzaWJsZScgJiYgdGhpcy5ub3RpZmljYXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdE9uQm90dG9tKSB7XG4gICAgICAgICAgY29tcCA9IHRoaXMubm90aWZpY2F0aW9uc1t0aGlzLm5vdGlmaWNhdGlvbnMubGVuZ3RoIC0gMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29tcCA9IHRoaXMubm90aWZpY2F0aW9uc1swXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnByZXZlbnRMYXN0RHVwbGljYXRlcyA9PT0gJ2FsbCcgJiYgdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZCkge1xuICAgICAgICBjb21wID0gdGhpcy5sYXN0Tm90aWZpY2F0aW9uQ3JlYXRlZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b0NoZWNrKGNvbXAsIGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNoZWNrU3RhbmRhcmQoY2hlY2tlcjogTm90aWZpY2F0aW9uLCBpdGVtOiBOb3RpZmljYXRpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hlY2tlci50eXBlID09PSBpdGVtLnR5cGUgJiYgY2hlY2tlci50aXRsZSA9PT0gaXRlbS50aXRsZSAmJiBjaGVja2VyLmNvbnRlbnQgPT09IGl0ZW0uY29udGVudDtcbiAgfVxuXG4gIGNoZWNrSHRtbChjaGVja2VyOiBOb3RpZmljYXRpb24sIGl0ZW06IE5vdGlmaWNhdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBjaGVja2VyLmh0bWwgP1xuICAgICAgY2hlY2tlci50eXBlID09PSBpdGVtLnR5cGUgJiYgY2hlY2tlci50aXRsZSA9PT0gaXRlbS50aXRsZSAmJiBjaGVja2VyLmNvbnRlbnQgPT09IGl0ZW0uY29udGVudCAmJiBjaGVja2VyLmh0bWwgPT09IGl0ZW0uaHRtbCA6XG4gICAgICBmYWxzZTtcbiAgfVxuXG4gIC8vIEF0dGFjaCBhbGwgdGhlIGNoYW5nZXMgcmVjZWl2ZWQgaW4gdGhlIG9wdGlvbnMgb2JqZWN0XG4gIGF0dGFjaENoYW5nZXMob3B0aW9uczogYW55KSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2ljb25zJykge1xuICAgICAgICB0aGlzLnNlcnZpY2UuaWNvbnMgPSBvcHRpb25zW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnVpbGRFbWl0KG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uLCB0bzogYm9vbGVhbikge1xuICAgIGNvbnN0IHRvRW1pdDogTm90aWZpY2F0aW9uID0ge1xuICAgICAgY3JlYXRlZE9uOiBub3RpZmljYXRpb24uY3JlYXRlZE9uLFxuICAgICAgdHlwZTogbm90aWZpY2F0aW9uLnR5cGUsXG4gICAgICBpY29uOiBub3RpZmljYXRpb24uaWNvbixcbiAgICAgIGlkOiBub3RpZmljYXRpb24uaWRcbiAgICB9O1xuXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5odG1sKSB7XG4gICAgICB0b0VtaXQuaHRtbCA9IG5vdGlmaWNhdGlvbi5odG1sO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0VtaXQudGl0bGUgPSBub3RpZmljYXRpb24udGl0bGU7XG4gICAgICB0b0VtaXQuY29udGVudCA9IG5vdGlmaWNhdGlvbi5jb250ZW50O1xuICAgIH1cblxuICAgIGlmICghdG8pIHtcbiAgICAgIHRvRW1pdC5kZXN0cm95ZWRPbiA9IG5ldyBEYXRlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvRW1pdDtcbiAgfVxuXG4gIGNsZWFuU2luZ2xlKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBsZXQgaW5kZXhPZkRlbGV0ZSA9IDA7XG4gICAgbGV0IGRvRGVsZXRlID0gZmFsc2U7XG4gICAgbGV0IG5vdGk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuZm9yRWFjaCgobm90aWZpY2F0aW9uLCBpZHgpID0+IHtcbiAgICAgIGlmIChub3RpZmljYXRpb24uaWQgPT09IGlkKSB7XG4gICAgICAgIGluZGV4T2ZEZWxldGUgPSBpZHg7XG4gICAgICAgIG5vdGkgPSBub3RpZmljYXRpb247XG4gICAgICAgIGRvRGVsZXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChkb0RlbGV0ZSkge1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zLnNwbGljZShpbmRleE9mRGVsZXRlLCAxKTtcbiAgICAgIHRoaXMuZGVzdHJveS5lbWl0KHRoaXMuYnVpbGRFbWl0KG5vdGksIGZhbHNlKSk7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwic2ltcGxlLW5vdGlmaWNhdGlvbi13cmFwcGVyXCIgW25nQ2xhc3NdPVwicG9zaXRpb25cIj5cbiAgICA8c2ltcGxlLW5vdGlmaWNhdGlvblxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGEgb2Ygbm90aWZpY2F0aW9uczsgbGV0IGkgPSBpbmRleFwiXG4gICAgICAgICAgICBbaXRlbV09XCJhXCJcbiAgICAgICAgICAgIFt0aW1lT3V0XT1cInRpbWVPdXRcIlxuICAgICAgICAgICAgW2NsaWNrVG9DbG9zZV09XCJjbGlja1RvQ2xvc2VcIlxuICAgICAgICAgICAgW2NsaWNrSWNvblRvQ2xvc2VdPVwiY2xpY2tJY29uVG9DbG9zZVwiXG4gICAgICAgICAgICBbbWF4TGVuZ3RoXT1cIm1heExlbmd0aFwiXG4gICAgICAgICAgICBbc2hvd1Byb2dyZXNzQmFyXT1cInNob3dQcm9ncmVzc0JhclwiXG4gICAgICAgICAgICBbcGF1c2VPbkhvdmVyXT1cInBhdXNlT25Ib3ZlclwiXG4gICAgICAgICAgICBbdGhlQ2xhc3NdPVwidGhlQ2xhc3NcIlxuICAgICAgICAgICAgW3J0bF09XCJydGxcIlxuICAgICAgICAgICAgW2FuaW1hdGVdPVwiYW5pbWF0ZVwiXG4gICAgICAgICAgICBbcG9zaXRpb25dPVwiaVwiPlxuICAgIDwvc2ltcGxlLW5vdGlmaWNhdGlvbj5cbjwvZGl2PiJdfQ==