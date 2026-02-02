import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-2xl font-bold">
            Mindworking CV
          </Link>

          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              to="/cvs"
              className="text-white/90 hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              CV'er
            </Link>
            <Link
              to="/companies"
              className="text-white/90 hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              Virksomheder
            </Link>
            <Link
              to="/education"
              className="text-white/90 hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              Uddannelser
            </Link>
            <Link
              to="/projects"
              className="text-white/90 hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              Projekter
            </Link>
            <Link
              to="/skills"
              className="text-white/90 hover:text-white"
              activeProps={{ className: 'text-white underline underline-offset-4' }}
            >
              Færdigheder
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
