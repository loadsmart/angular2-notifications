import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { NotificationComponent } from './components/notification/notification.component';
import { SimpleNotificationsComponent } from './components/simple-notifications/simple-notifications.component';
import { DEFAULT_OPTIONS } from './consts/default-options.const';
import { NotificationsService } from './services/notifications.service';
import * as i0 from "@angular/core";
export const OPTIONS = new InjectionToken('options');
export function optionsFactory(options) {
    return Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
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
SimpleNotificationsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SimpleNotificationsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsModule, declarations: [SimpleNotificationsComponent,
        NotificationComponent], imports: [CommonModule], exports: [SimpleNotificationsComponent] });
SimpleNotificationsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsModule, imports: [[
            CommonModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.16", ngImport: i0, type: SimpleNotificationsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                    ],
                    declarations: [
                        SimpleNotificationsComponent,
                        NotificationComponent
                    ],
                    exports: [SimpleNotificationsComponent]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9zaW1wbGUtbm90aWZpY2F0aW9ucy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQXVCLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN6RixPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUNoSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFakUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7O0FBRXhFLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsQ0FBVSxTQUFTLENBQUMsQ0FBQztBQUM5RCxNQUFNLFVBQVUsY0FBYyxDQUFDLE9BQU87SUFDcEMsdUNBQ0ssZUFBZSxHQUNmLE9BQU8sRUFDVjtBQUNKLENBQUM7QUFZRCxNQUFNLE9BQU8seUJBQXlCO0lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBbUIsRUFBRTtRQUNsQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLHlCQUF5QjtZQUNuQyxTQUFTLEVBQUU7Z0JBQ1Qsb0JBQW9CO2dCQUNwQjtvQkFDRSxPQUFPLEVBQUUsT0FBTztvQkFDaEIsUUFBUSxFQUFFLE9BQU87aUJBQ2xCO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxTQUFTO29CQUNsQixVQUFVLEVBQUUsY0FBYztvQkFDMUIsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUNoQjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O3VIQWpCVSx5QkFBeUI7d0hBQXpCLHlCQUF5QixpQkFMbEMsNEJBQTRCO1FBQzVCLHFCQUFxQixhQUpyQixZQUFZLGFBTUosNEJBQTRCO3dIQUUzQix5QkFBeUIsWUFUM0I7WUFDUCxZQUFZO1NBQ2I7NEZBT1UseUJBQXlCO2tCQVZyQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRTt3QkFDWiw0QkFBNEI7d0JBQzVCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsNEJBQTRCLENBQUM7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7IFNpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc2ltcGxlLW5vdGlmaWNhdGlvbnMvc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfT1BUSU9OUyB9IGZyb20gJy4vY29uc3RzL2RlZmF1bHQtb3B0aW9ucy5jb25zdCc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzL29wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IE9QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48T3B0aW9ucz4oJ29wdGlvbnMnKTtcbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25zRmFjdG9yeShvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLm9wdGlvbnNcbiAgfTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgU2ltcGxlTm90aWZpY2F0aW9uc0NvbXBvbmVudCxcbiAgICBOb3RpZmljYXRpb25Db21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1NpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChvcHRpb25zOiBPcHRpb25zID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBPUFRJT05TLFxuICAgICAgICAgIHVzZVZhbHVlOiBvcHRpb25zXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiAnb3B0aW9ucycsXG4gICAgICAgICAgdXNlRmFjdG9yeTogb3B0aW9uc0ZhY3RvcnksXG4gICAgICAgICAgZGVwczogW09QVElPTlNdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=