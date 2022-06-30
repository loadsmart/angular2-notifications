import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { SimpleNotificationsComponent } from './components/simple-notifications/simple-notifications.component';
import { DEFAULT_OPTIONS } from './consts/default-options.const';
import { NotificationsService } from './services/notifications.service';
import * as i0 from "@angular/core";
export const OPTIONS = new InjectionToken('options');
export function optionsFactory(options) {
    return {
        ...DEFAULT_OPTIONS,
        ...options
    };
}
export class SimpleNotificationsModule {
    static forRoot(options = {}) {
        return {
            ngModule: SimpleNotificationsModule,
            providers: [
                NotificationsService,
                {
                    provide: OPTIONS,
                    useValue: options
                },
                {
                    provide: 'options',
                    useFactory: optionsFactory,
                    deps: [OPTIONS]
                }
            ]
        };
    }
}
SimpleNotificationsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SimpleNotificationsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsModule, declarations: [SimpleNotificationsComponent,
        NotificationComponent], imports: [CommonModule], exports: [SimpleNotificationsComponent] });
SimpleNotificationsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsModule, imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.11", ngImport: i0, type: SimpleNotificationsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        SimpleNotificationsComponent,
                        NotificationComponent
                    ],
                    exports: [SimpleNotificationsComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9zaW1wbGUtbm90aWZpY2F0aW9ucy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN6RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUNoSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFakUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBRXhFLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBVSxTQUFTLENBQUMsQ0FBQztBQUM5RCxNQUFNLFVBQVUsY0FBYyxDQUFDLE9BQU87SUFDcEMsT0FBTztRQUNMLEdBQUcsZUFBZTtRQUNsQixHQUFHLE9BQU87S0FDWCxDQUFDO0FBQ0osQ0FBQztBQVlELE1BQU0sT0FBTyx5QkFBeUI7SUFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFtQixFQUFFO1FBQ2xDLE9BQU87WUFDTCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLFNBQVMsRUFBRTtnQkFDVCxvQkFBb0I7Z0JBQ3BCO29CQUNFLE9BQU8sRUFBRSxPQUFPO29CQUNoQixRQUFRLEVBQUUsT0FBTztpQkFDbEI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLFNBQVM7b0JBQ2xCLFVBQVUsRUFBRSxjQUFjO29CQUMxQixJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQ2hCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7dUhBakJVLHlCQUF5Qjt3SEFBekIseUJBQXlCLGlCQUxsQyw0QkFBNEI7UUFDNUIscUJBQXFCLGFBSnJCLFlBQVksYUFNSiw0QkFBNEI7d0hBRTNCLHlCQUF5QixZQVQzQjtZQUNQLFlBQVk7U0FDYjs0RkFPVSx5QkFBeUI7a0JBVnJDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLDRCQUE0Qjt3QkFDNUIscUJBQXFCO3FCQUN0QjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyw0QkFBNEIsQ0FBQztpQkFDeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25Db21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL25vdGlmaWNhdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2ltcGxlTm90aWZpY2F0aW9uc0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zaW1wbGUtbm90aWZpY2F0aW9ucy9zaW1wbGUtbm90aWZpY2F0aW9ucy5jb21wb25lbnQnO1xuaW1wb3J0IHsgREVGQVVMVF9PUFRJT05TIH0gZnJvbSAnLi9jb25zdHMvZGVmYXVsdC1vcHRpb25zLmNvbnN0JztcbmltcG9ydCB7IE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMvb3B0aW9ucy50eXBlJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbnNTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9ub3RpZmljYXRpb25zLnNlcnZpY2UnO1xuXG5leHBvcnQgY29uc3QgT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxPcHRpb25zPignb3B0aW9ucycpO1xuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbnNGYWN0b3J5KG9wdGlvbnMpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5ERUZBVUxUX09QVElPTlMsXG4gICAgLi4ub3B0aW9uc1xuICB9O1xufVxuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFNpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnQsXG4gICAgTm90aWZpY2F0aW9uQ29tcG9uZW50XG4gIF0sXG4gIGV4cG9ydHM6IFtTaW1wbGVOb3RpZmljYXRpb25zQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBTaW1wbGVOb3RpZmljYXRpb25zTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3Qob3B0aW9uczogT3B0aW9ucyA9IHt9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxTaW1wbGVOb3RpZmljYXRpb25zTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTaW1wbGVOb3RpZmljYXRpb25zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIE5vdGlmaWNhdGlvbnNTZXJ2aWNlLFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogT1BUSU9OUyxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0aW9uc1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogJ29wdGlvbnMnLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG9wdGlvbnNGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtPUFRJT05TXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19