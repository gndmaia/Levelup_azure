export default function AdminImportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Import Questions</h1>
        <p className="text-neutral-600 mb-6">
          Admin interface for importing questions via CSV/JSON upload.
        </p>
        <p className="text-sm text-neutral-500">
          Full import functionality with validation is implemented in the API at /api/admin/questions/import
        </p>
      </div>
    </div>
  );
}
