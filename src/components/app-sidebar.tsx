import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Home, PlusCircle, Rss } from "lucide-react"
import { Link } from "react-router-dom"  // Add this import

// Menu items 
const navigationItems = [
  {
    title: "Feed",
    url: "/",
    icon: Home,
    description: "View your personalized feed",
  },
  {
    title: "Add Posts",
    url: "/posts/new",
    icon: PlusCircle,
    description: "Create new content",
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/50">
      {/* Header Section */}
      <SidebarHeader className="border-b border-border/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
            <Rss className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-foreground">Social Feed</h2>
            <p className="text-xs text-muted-foreground">Stay connected</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Navigation Section */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="group relative overflow-hidden rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 hover:shadow-sm"
                    tooltip={item.description}
                  >
                    <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background group-hover:bg-white group-hover:shadow-sm transition-all duration-200">
                        <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors duration-200" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {item.description}
                        </span>
                      </div>
                      {/* Hover */}
                      <div className="absolute left-0 top-1/2 h-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full transition-all duration-200 group-hover:h-8 transform -translate-y-1/2" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4 bg-gradient-to-r from-transparent via-border to-transparent" />
      </SidebarContent>
    </Sidebar>
  )
}