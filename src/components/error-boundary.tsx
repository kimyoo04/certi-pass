import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-background px-4 text-center">
          <p className="text-4xl mb-4">:(</p>
          <h1 className="text-lg font-semibold mb-2">오류가 발생했습니다</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {this.state.error?.message ?? "알 수 없는 오류"}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.hash = "/";
              window.location.reload();
            }}
          >
            홈으로 돌아가기
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
