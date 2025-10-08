    export default function AboutAI900Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">About Azure AI-900</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-600 mb-6">
            The Microsoft Azure AI Fundamentals (AI-900) certification demonstrates foundational knowledge of machine learning and artificial intelligence concepts and related Microsoft Azure services.
          </p>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Exam Topics</h2>
          <ul className="space-y-2 text-neutral-700">
            <li>• Describe Artificial Intelligence workloads and considerations (15-20%)</li>
            <li>• Describe fundamental principles of machine learning on Azure (30-35%)</li>
            <li>• Describe features of computer vision workloads on Azure (15-20%)</li>
            <li>• Describe features of Natural Language Processing (NLP) workloads on Azure (15-20%)</li>
            <li>• Describe features of conversational AI workloads on Azure (15-20%)</li>
          </ul>

          <h2 className="text-2xl font-bold text-neutral-900 mt-8 mb-4">Key Services Covered</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold mb-2">Azure Machine Learning</h3>
              <p className="text-sm text-neutral-600">Build, train, and deploy ML models</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold mb-2">Computer Vision</h3>
              <p className="text-sm text-neutral-600">Image analysis and object detection</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold mb-2">Language Service</h3>
              <p className="text-sm text-neutral-600">NLP and text analytics</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-semibold mb-2">Speech Service</h3>
              <p className="text-sm text-neutral-600">Speech recognition and synthesis</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-primary-50 rounded-lg">
            <h3 className="font-semibold text-primary-900 mb-2">Official Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://docs.microsoft.com/en-us/certifications/azure-ai-fundamentals/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                  Official AI-900 Certification Page →
                </a>
              </li>
              <li>
                <a href="https://docs.microsoft.com/en-us/azure/cognitive-services/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                  Azure AI Services Documentation →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
