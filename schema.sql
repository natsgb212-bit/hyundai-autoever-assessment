create extension if not exists pgcrypto;

alter table public.assessment_submissions
  add column if not exists open_answers jsonb not null default '[]'::jsonb,
  add column if not exists auto_score integer not null default 0,
  add column if not exists manual_score integer not null default 0,
  add column if not exists final_score integer not null default 0,
  add column if not exists final_passed boolean not null default false,
  add column if not exists review_comments text,
  add column if not exists reviewed_at timestamptz;

alter table public.assessment_submissions enable row level security;

revoke all on public.assessment_submissions from anon, authenticated;

drop policy if exists "HR can read assessments" on public.assessment_submissions;
drop policy if exists "HR can update assessments" on public.assessment_submissions;

create policy "HR can read assessments"
on public.assessment_submissions for select to authenticated using (true);

create policy "HR can update assessments"
on public.assessment_submissions for update to authenticated using (true) with check (true);

grant select, update on public.assessment_submissions to authenticated;

create or replace function public.submit_assessment(p_submission jsonb)
returns jsonb
language plpgsql
security definer
set search_path=public
as $$
declare
  q record;
  sub jsonb := coalesce(p_submission->'answers','{}'::jsonb);
  auto_total int := 0;
  sel int;
  open_data jsonb;
begin
  create temp table tq(id text primary key, p int, a int) on commit drop;
  insert into tq values
    ('Q01',3,1),('Q02',3,2),('Q03',3,2),('Q04',3,2),('Q07',2,2),
    ('Q09',3,1),('Q11',3,3),('Q12',3,1),('Q13',3,1),
    ('Q21',3,1),('Q22',4,2),('Q23',4,2),('Q24',4,1),('Q25',3,2),
    ('Q26',3,1),('Q27',3,1);

  for q in select * from tq loop
    begin sel := (sub->>q.id)::int; exception when others then sel := null; end;
    if sel = q.a then auto_total := auto_total + q.p; end if;
  end loop;

  open_data := jsonb_build_array(
    jsonb_build_object('question','Q05','question_text','What is the difference between a Clustered Index and a Nonclustered Index?','answer',coalesce(sub->>'Q05',''),'max_points',5,'points',null),
    jsonb_build_object('question','Q06','question_text','A query that used to run in 2 seconds now takes 3 minutes. Mention three actions you would take to troubleshoot it.','answer',coalesce(sub->>'Q06',''),'max_points',5,'points',null),
    jsonb_build_object('question','Q08','question_text','What information can be obtained from an Execution Plan?','answer',coalesce(sub->>'Q08',''),'max_points',6,'points',null),
    jsonb_build_object('question','Q10','question_text','What is the difference between a Field and a Property?','answer',coalesce(sub->>'Q10',''),'max_points',5,'points',null),
    jsonb_build_object('question','Q14','question_text','Explain how you would consume a REST API from a C# application.','answer',coalesce(sub->>'Q14',''),'max_points',5,'points',null),
    jsonb_build_object('question','Q15','question_text','What is the purpose of using Async and Await?','answer',coalesce(sub->>'Q15',''),'max_points',6,'points',null),
    jsonb_build_object('question','Q16','question_text','An operator reports that a workstation cannot access MES. What would be your first troubleshooting steps?','answer',coalesce(sub->>'Q16',''),'max_points',3,'points',null),
    jsonb_build_object('question','Q17','question_text','How would you determine whether a problem is related to the network, server, or application?','answer',coalesce(sub->>'Q17',''),'max_points',3,'points',null),
    jsonb_build_object('question','Q18','question_text','How would you verify communication between a workstation and a PLC/device on the network?','answer',coalesce(sub->>'Q18',''),'max_points',3,'points',null),
    jsonb_build_object('question','Q19','question_text','What information would you collect before escalating a production system issue?','answer',coalesce(sub->>'Q19',''),'max_points',3,'points',null),
    jsonb_build_object('question','Q20','question_text','What is the difference between a production issue and a system issue?','answer',coalesce(sub->>'Q20',''),'max_points',3,'points',null),
    jsonb_build_object('question','Q28','question_text','Describe a situation where you would use exception handling (try-catch) in a production application. What risks would exist if it were not implemented correctly?','answer',coalesce(sub->>'Q28',''),'max_points',1,'points',null),
    jsonb_build_object('question','Q29','question_text','A C# application needs to query information from a SQL Server database and display it to the operator on an MES screen. Describe the main steps you would follow to implement this functionality.','answer',coalesce(sub->>'Q29',''),'max_points',2,'points',null)
  );

  insert into public.assessment_submissions
    (candidate_name,candidate_email,experience_years,started_at,finished_at,time_remaining_seconds,
     answers,open_answers,auto_score,manual_score,final_score,final_passed)
  values
    (p_submission->>'candidate_name',p_submission->>'candidate_email',
     nullif(p_submission->>'experience_years','')::numeric,
     (p_submission->>'started_at')::timestamptz,(p_submission->>'finished_at')::timestamptz,
     (p_submission->>'time_remaining_seconds')::int,sub,open_data,auto_total,0,auto_total,false);

  return jsonb_build_object('ok',true,'auto_score',auto_total);
end
$$;

revoke all on function public.submit_assessment(jsonb) from public;
grant execute on function public.submit_assessment(jsonb) to anon, authenticated;
