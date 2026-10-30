import ImportedPracticeLanding from '@/components/ImportedPracticeLanding';
import { IMPORTED_PRACTICE_EXAMS } from '@/lib/imported-practice';

export default function AI200Page() {
  return <ImportedPracticeLanding exam={IMPORTED_PRACTICE_EXAMS['AI-200']} />;
}
