import type { ThemeConfig } from "antd"

export const CustomAntTheme: ThemeConfig = {
   components: {
      Input: {
         hoverBorderColor: "#6b7280",
         activeBorderColor: "#6b7280",
      },
      Form: {
         labelFontSize: 14,
      },
      Button: {
         primaryShadow: "0 0 0 #fff",
         textHoverBg: "#212121",
         colorText: "#fff",
      },
   },
   token: {
      colorPrimary: "#fffffff9", //white
      colorPrimaryHover: "#6b7280",
      colorPrimaryBgHover: "#6b7280",
      fontSize: 16,
      purple: "#766AC8",
      colorInfo: "white",
      colorBgSpotlight: "#8b5cf6", //tooltip background-color,
      colorPrimaryBg: "#fffffff9",
   },
}
