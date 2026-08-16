import { useState, useCallback, useEffect } from 'react';
import { useTeacherStore } from '../store/useTeacherStore';

export function useTeacherAnalytics(apiBaseUrl: string = 'http://localhost:8000') {
  const { classId, setSummary, setAIActionPlan, setIsGeneratingPlan, isGeneratingPlan, summary } = useTeacherStore();
  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);

  const fetchClassSummary = useCallback(async () => {
    setIsLoadingSummary(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/teacher/class-summary/${classId}`);
      const data = await response.json();
      if (data && data.class_id) {
        setSummary(data);
      }
    } catch (err) {
      console.warn('Backend offline, using local classroom summary fallback:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [apiBaseUrl, classId, setSummary]);

  const generatePedagogicalPlan = useCallback(async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/teacher/generate-action-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          total_students: summary?.total_students || 4,
          high_stress_count: summary?.high_stress_count || 1,
          lowest_skill: 'fractions_addition',
          lowest_p_lt: 0.54
        })
      });
      const data = await response.json();
      if (data && Array.isArray(data.action_plan)) {
        setAIActionPlan(data.action_plan);
      }
    } catch (err) {
      console.warn('Backend offline, using fallback action plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  }, [apiBaseUrl, classId, summary, setAIActionPlan, setIsGeneratingPlan]);

  useEffect(() => {
    fetchClassSummary();
  }, [fetchClassSummary]);

  return {
    isLoadingSummary,
    isGeneratingPlan,
    fetchClassSummary,
    generatePedagogicalPlan
  };
}
