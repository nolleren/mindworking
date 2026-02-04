import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Velkommen til Mindworking CV</h1>
        <p className="text-lg text-gray-600 mb-8">
          Administrer dine CV'er, virksomheder, uddannelser, projekter og færdigheder.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/cvs"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-primary-600 mb-2">CV'er</h3>
            <p className="text-gray-600">Administrer dine CV'er</p>
          </Link>

          <Link
            to="/companies"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Virksomheder</h3>
            <p className="text-gray-600">Administrer virksomheder</p>
          </Link>

          <Link
            to="/educations"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Uddannelser</h3>
            <p className="text-gray-600">Administrer uddannelser</p>
          </Link>

          <Link
            to="/projects"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Projekter</h3>
            <p className="text-gray-600">Administrer projekter</p>
          </Link>

          <Link
            to="/skills"
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-primary-600 mb-2">Færdigheder</h3>
            <p className="text-gray-600">Administrer færdigheder</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
