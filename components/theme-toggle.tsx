"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before showing theme-dependent content
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine what to show based on current theme
  const getThemeDisplay = () => {
    if (!mounted) {
      // Return a default state during SSR to prevent hydration mismatch
      return {
        icon: <Sun className="h-4 w-4" />,
        text: "Theme",
        ariaLabel: "Toggle theme"
      }
    }

    if (theme === "system") {
      const isSystemDark = resolvedTheme === "dark"
      return {
        icon: isSystemDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
        text: `Theme`,
        ariaLabel: `System theme active - currently ${isSystemDark ? "dark" : "light"} mode`
      }
    } else if (resolvedTheme === "dark") {
      return {
        icon: <Moon className="h-4 w-4" />,
        text: "Dark",
        ariaLabel: "Dark theme active"
      }
    } else {
      return {
        icon: <Sun className="h-4 w-4" />,
        text: "Light",
        ariaLabel: "Light theme active"
      }
    }
  }

  const currentDisplay = getThemeDisplay()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 md:h-9 w-8 md:w-auto px-0 md:px-3 bg-background hover:bg-accent hover:text-accent-foreground border-input transition-colors"
          suppressHydrationWarning
          aria-label={currentDisplay.ariaLabel}
        >
          <div className="flex items-center gap-2">
            <div className="transition-all duration-200">
              {currentDisplay.icon}
            </div>
            <span className="hidden md:inline text-sm font-medium">
              {currentDisplay.text}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={`gap-2 cursor-pointer ${mounted && theme === "light" ? "bg-accent" : ""}`}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {mounted && theme === "light" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={`gap-2 cursor-pointer ${mounted && theme === "dark" ? "bg-accent" : ""}`}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {mounted && theme === "dark" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={`gap-2 cursor-pointer ${mounted && theme === "system" ? "bg-accent" : ""}`}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {mounted && theme === "system" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
          )}
        </DropdownMenuItem>
        {mounted && theme === "system" && resolvedTheme && (
          <div className="px-2 py-1.5 text-xs text-muted-foreground border-t">
            Currently: {resolvedTheme === "dark" ? "Dark" : "Light"}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
