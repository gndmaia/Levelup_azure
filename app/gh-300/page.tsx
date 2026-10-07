import ImportedPracticeLanding from '@/components/ImportedPracticeLanding';
import { IMPORTED_PRACTICE_EXAMS } from '@/lib/imported-practice';

export default function GH300Page() {
  return <ImportedPracticeLanding exam={IMPORTED_PRACTICE_EXAMS['GH-300']} />;
}
