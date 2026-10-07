import FormsPracticeLanding from '@/components/FormsPracticeLanding';
import { FORMS_PRACTICE_EXAMS } from '@/lib/forms-practice';

export default function AB730Page() {
  return <FormsPracticeLanding exam={FORMS_PRACTICE_EXAMS['AB-730']} />;
}
