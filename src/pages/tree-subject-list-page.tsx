import { useNavigate, useParams } from 'react-router-dom'

import { MobileLayout } from '@/components/mobile-layout'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { countNodes } from '@/utils/tree-utils'
import { examStructure } from '@/data/exam-tree'

export function TreeSubjectListPage() {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()

  const sections = [
    { label: '1차 시험', subjects: examStructure.firstExam },
    { label: '2차 시험', subjects: examStructure.secondExam },
  ]

  return (
    <MobileLayout title="개념 트리" showBack>
      <div className="space-y-5">
        {sections.map((section) => (
          <div key={section.label}>
            <h2 className="text-muted-foreground mb-2 text-sm font-semibold">{section.label}</h2>
            <div className="space-y-2">
              {section.subjects.map((subject) => {
                const nodeCount = countNodes(subject.tree)
                return (
                  <Card
                    key={subject.id}
                    className="hover:border-primary/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/exam/${examId}/tree/${subject.id}`)}
                  >
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{subject.name}</CardTitle>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-xs">
                            {nodeCount}개 개념
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {subject.questionCount}문항
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="mt-1 text-xs">
                        {subject.tree.map((n) => n.label).join(' · ')}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </MobileLayout>
  )
}
