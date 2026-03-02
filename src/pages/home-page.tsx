import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MobileLayout } from "@/components/mobile-layout";
import type { Exam } from "@/types";
import { DATA_PATHS } from "@/constants";

export function HomePage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(DATA_PATHS.EXAMS)
      .then((res) => res.json())
      .then(setExams);
  }, []);

  return (
    <MobileLayout title="CertiPass">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          자격증을 선택하여 학습을 시작하세요
        </p>
      </div>

      <div className="space-y-3">
        {exams.map((exam) => (
          <Card
            key={exam.id}
            className={`cursor-pointer transition-colors ${
              exam.isActive
                ? "hover:border-primary/50"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => exam.isActive && navigate(`/exam/${exam.id}`)}
          >
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{exam.name}</CardTitle>
                <Badge variant={exam.isActive ? "default" : "secondary"}>
                  {exam.isActive ? "학습 가능" : "준비 중"}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {exam.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </MobileLayout>
  );
}
