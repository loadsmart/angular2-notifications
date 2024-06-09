export const DEFAULT_ICONS = {
    alert: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
    `,
    error: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        </svg>
    `,
    info: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
        </svg>
    `,
    success: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
    `,
    warn: `
        <svg class="simple-notification-svg" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" width="64" viewBox="0 0 64 64" height="64">
          <circle cx="32.086" cy="50.142" r="2.256"/>
          <path d="M30.08 25.012V42.32c0 1.107.897 2.005 2.006 2.005s2.006-.897 2.006-2.005V25.012c0-1.107-.897-2.006-2.006-2.006s-2.006.898-2.006 2.006z"/>
          <path d="M63.766 59.234L33.856 3.082c-.697-1.308-2.844-1.308-3.54 0L.407 59.234c-.331.622-.312 1.372.051 1.975.362.605 1.015.975 1.72.975h59.816c.705 0 1.357-.369 1.721-.975.361-.603.381-1.353.051-1.975zM5.519 58.172L32.086 8.291l26.568 49.881H5.519z"/>
        </svg>
    `
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1pY29ucy5jb25zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXIyLW5vdGlmaWNhdGlvbnMvc3JjL2xpYi9jb25zdHMvZGVmYXVsdC1pY29ucy5jb25zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQVU7SUFDbEMsS0FBSyxFQUFFOzs7OztLQUtKO0lBQ0gsS0FBSyxFQUFFOzs7OztLQUtKO0lBQ0gsSUFBSSxFQUFFOzs7OztLQUtIO0lBQ0gsT0FBTyxFQUFFOzs7OztLQUtOO0lBQ0gsSUFBSSxFQUFFOzs7Ozs7S0FNSDtDQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0ljb25zfSBmcm9tICcuLi9pbnRlcmZhY2VzL2ljb25zJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSUNPTlM6IEljb25zID0ge1xuICBhbGVydDogYFxuICAgICAgICA8c3ZnIGNsYXNzPVwic2ltcGxlLW5vdGlmaWNhdGlvbi1zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cIiNmZmZmZmZcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwelwiIGZpbGw9XCJub25lXCIvPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0yMiA1LjcybC00LjYtMy44Ni0xLjI5IDEuNTMgNC42IDMuODZMMjIgNS43MnpNNy44OCAzLjM5TDYuNiAxLjg2IDIgNS43MWwxLjI5IDEuNTMgNC41OS0zLjg1ek0xMi41IDhIMTF2Nmw0Ljc1IDIuODUuNzUtMS4yMy00LTIuMzdWOHpNMTIgNGMtNC45NyAwLTkgNC4wMy05IDlzNC4wMiA5IDkgOWM0Ljk3IDAgOS00LjAzIDktOXMtNC4wMy05LTktOXptMCAxNmMtMy44NyAwLTctMy4xMy03LTdzMy4xMy03IDctNyA3IDMuMTMgNyA3LTMuMTMgNy03IDd6XCIvPlxuICAgICAgICA8L3N2Zz5cbiAgICBgLFxuICBlcnJvcjogYFxuICAgICAgICA8c3ZnIGNsYXNzPVwic2ltcGxlLW5vdGlmaWNhdGlvbi1zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cIiNmZmZmZmZcIiBoZWlnaHQ9XCIyNFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiB3aWR0aD1cIjI0XCI+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTAgMGgyNHYyNEgwVjB6XCIgZmlsbD1cIm5vbmVcIi8+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTExIDE1aDJ2MmgtMnptMC04aDJ2NmgtMnptLjk5LTVDNi40NyAyIDIgNi40OCAyIDEyczQuNDcgMTAgOS45OSAxMEMxNy41MiAyMiAyMiAxNy41MiAyMiAxMlMxNy41MiAyIDExLjk5IDJ6TTEyIDIwYy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgIGAsXG4gIGluZm86IGBcbiAgICAgICAgPHN2ZyBjbGFzcz1cInNpbXBsZS1ub3RpZmljYXRpb24tc3ZnXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCIjZmZmZmZmXCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTEgMTdoMnYtNmgtMnY2em0xLTE1QzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQxIDAtOC0zLjU5LTgtOHMzLjU5LTggOC04IDggMy41OSA4IDgtMy41OSA4LTggOHpNMTEgOWgyVjdoLTJ2MnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgIGAsXG4gIHN1Y2Nlc3M6IGBcbiAgICAgICAgPHN2ZyBjbGFzcz1cInNpbXBsZS1ub3RpZmljYXRpb24tc3ZnXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIGZpbGw9XCIjZmZmZmZmXCIgaGVpZ2h0PVwiMjRcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgd2lkdGg9XCIyNFwiPlxuICAgICAgICAgICAgPHBhdGggZD1cIk0wIDBoMjR2MjRIMHpcIiBmaWxsPVwibm9uZVwiLz5cbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNOSAxNi4yTDQuOCAxMmwtMS40IDEuNEw5IDE5IDIxIDdsLTEuNC0xLjRMOSAxNi4yelwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgYCxcbiAgd2FybjogYFxuICAgICAgICA8c3ZnIGNsYXNzPVwic2ltcGxlLW5vdGlmaWNhdGlvbi1zdmdcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgZmlsbD1cIiNmZmZmZmZcIiB3aWR0aD1cIjY0XCIgdmlld0JveD1cIjAgMCA2NCA2NFwiIGhlaWdodD1cIjY0XCI+XG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjMyLjA4NlwiIGN5PVwiNTAuMTQyXCIgcj1cIjIuMjU2XCIvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMzAuMDggMjUuMDEyVjQyLjMyYzAgMS4xMDcuODk3IDIuMDA1IDIuMDA2IDIuMDA1czIuMDA2LS44OTcgMi4wMDYtMi4wMDVWMjUuMDEyYzAtMS4xMDctLjg5Ny0yLjAwNi0yLjAwNi0yLjAwNnMtMi4wMDYuODk4LTIuMDA2IDIuMDA2elwiLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTYzLjc2NiA1OS4yMzRMMzMuODU2IDMuMDgyYy0uNjk3LTEuMzA4LTIuODQ0LTEuMzA4LTMuNTQgMEwuNDA3IDU5LjIzNGMtLjMzMS42MjItLjMxMiAxLjM3Mi4wNTEgMS45NzUuMzYyLjYwNSAxLjAxNS45NzUgMS43Mi45NzVoNTkuODE2Yy43MDUgMCAxLjM1Ny0uMzY5IDEuNzIxLS45NzUuMzYxLS42MDMuMzgxLTEuMzUzLjA1MS0xLjk3NXpNNS41MTkgNTguMTcyTDMyLjA4NiA4LjI5MWwyNi41NjggNDkuODgxSDUuNTE5elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgYFxufTtcbiJdfQ==