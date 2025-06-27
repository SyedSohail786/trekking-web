import { create } from "zustand";

export const ThemeSet = create ((set)=>({
     theme: localStorage.getItem("heyChat-theme") || "dark",
     setTheme: (theme) =>{
          localStorage.setItem("heyChat-theme", theme)
          set({theme})
     }
}))