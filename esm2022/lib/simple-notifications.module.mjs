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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsModule, declarations: [SimpleNotificationsComponent,
            NotificationComponent], imports: [CommonModule], exports: [SimpleNotificationsComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsModule, imports: [CommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.11", ngImport: i0, type: SimpleNotificationsModule, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxlLW5vdGlmaWNhdGlvbnMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhcjItbm90aWZpY2F0aW9ucy9zcmMvbGliL3NpbXBsZS1ub3RpZmljYXRpb25zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGNBQWMsRUFBdUIsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ3pGLE9BQU8sRUFBRSw0QkFBNEIsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQ2hILE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVqRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7QUFFeEUsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBYyxDQUFVLFNBQVMsQ0FBQyxDQUFDO0FBQzlELE1BQU0sVUFBVSxjQUFjLENBQUMsT0FBTztJQUNwQyxPQUFPO1FBQ0wsR0FBRyxlQUFlO1FBQ2xCLEdBQUcsT0FBTztLQUNYLENBQUM7QUFDSixDQUFDO0FBWUQsTUFBTSxPQUFPLHlCQUF5QjtJQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQW1CLEVBQUU7UUFDbEMsT0FBTztZQUNMLFFBQVEsRUFBRSx5QkFBeUI7WUFDbkMsU0FBUyxFQUFFO2dCQUNULG9CQUFvQjtnQkFDcEI7b0JBQ0UsT0FBTyxFQUFFLE9BQU87b0JBQ2hCLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsU0FBUztvQkFDbEIsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztpQkFDaEI7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO3dHQWpCVSx5QkFBeUI7eUdBQXpCLHlCQUF5QixpQkFMbEMsNEJBQTRCO1lBQzVCLHFCQUFxQixhQUpyQixZQUFZLGFBTUosNEJBQTRCO3lHQUUzQix5QkFBeUIsWUFSbEMsWUFBWTs7NEZBUUgseUJBQXlCO2tCQVZyQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3FCQUNiO29CQUNELFlBQVksRUFBRTt3QkFDWiw0QkFBNEI7d0JBQzVCLHFCQUFxQjtxQkFDdEI7b0JBQ0QsT0FBTyxFQUFFLENBQUMsNEJBQTRCLENBQUM7aUJBQ3hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbi9ub3RpZmljYXRpb24uY29tcG9uZW50JztcbmltcG9ydCB7IFNpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc2ltcGxlLW5vdGlmaWNhdGlvbnMvc2ltcGxlLW5vdGlmaWNhdGlvbnMuY29tcG9uZW50JztcbmltcG9ydCB7IERFRkFVTFRfT1BUSU9OUyB9IGZyb20gJy4vY29uc3RzL2RlZmF1bHQtb3B0aW9ucy5jb25zdCc7XG5pbXBvcnQgeyBPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzL29wdGlvbnMudHlwZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4vc2VydmljZXMvbm90aWZpY2F0aW9ucy5zZXJ2aWNlJztcblxuZXhwb3J0IGNvbnN0IE9QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48T3B0aW9ucz4oJ29wdGlvbnMnKTtcbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25zRmFjdG9yeShvcHRpb25zKSB7XG4gIHJldHVybiB7XG4gICAgLi4uREVGQVVMVF9PUFRJT05TLFxuICAgIC4uLm9wdGlvbnNcbiAgfTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgU2ltcGxlTm90aWZpY2F0aW9uc0NvbXBvbmVudCxcbiAgICBOb3RpZmljYXRpb25Db21wb25lbnRcbiAgXSxcbiAgZXhwb3J0czogW1NpbXBsZU5vdGlmaWNhdGlvbnNDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdChvcHRpb25zOiBPcHRpb25zID0ge30pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNpbXBsZU5vdGlmaWNhdGlvbnNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgTm90aWZpY2F0aW9uc1NlcnZpY2UsXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBPUFRJT05TLFxuICAgICAgICAgIHVzZVZhbHVlOiBvcHRpb25zXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiAnb3B0aW9ucycsXG4gICAgICAgICAgdXNlRmFjdG9yeTogb3B0aW9uc0ZhY3RvcnksXG4gICAgICAgICAgZGVwczogW09QVElPTlNdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=