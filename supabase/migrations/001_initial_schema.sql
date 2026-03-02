-- profiles: auth.usersトリガーで自動作成
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  total_xp integer not null default 0,
  current_level integer not null default 1,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  total_questions_answered integer not null default 0,
  total_correct integer not null default 0,
  last_played_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- quiz_sessions: クイズセッション
create table if not exists quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_slug text not null,
  difficulty_level smallint not null default 2,
  total_questions smallint not null,
  correct_count smallint not null,
  total_xp integer not null default 0,
  time_taken_seconds integer not null,
  is_perfect boolean not null default false,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- quiz_answers: 各回答の記録
create table if not exists quiz_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references quiz_sessions(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  question_id text not null,
  user_answer text not null,
  is_correct boolean not null,
  time_taken_seconds integer not null,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now()
);

-- user_badges: 獲得バッジ
create table if not exists user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- user_question_stats: SM-2 間隔反復用
create table if not exists user_question_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  question_id text not null,
  times_seen integer not null default 0,
  times_correct integer not null default 0,
  ease_factor real not null default 2.5,
  interval_days integer not null default 1,
  next_review_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (user_id, question_id)
);

-- インデックス
create index if not exists idx_quiz_sessions_user_id on quiz_sessions(user_id);
create index if not exists idx_quiz_sessions_category on quiz_sessions(category_slug);
create index if not exists idx_quiz_answers_session_id on quiz_answers(session_id);
create index if not exists idx_quiz_answers_user_id on quiz_answers(user_id);
create index if not exists idx_user_badges_user_id on user_badges(user_id);
create index if not exists idx_user_question_stats_user_id on user_question_stats(user_id);
create index if not exists idx_user_question_stats_review on user_question_stats(user_id, next_review_at);

-- RLS
alter table profiles enable row level security;
alter table quiz_sessions enable row level security;
alter table quiz_answers enable row level security;
alter table user_badges enable row level security;
alter table user_question_stats enable row level security;

-- profiles RLS: 自分のプロフィールのみ読み書き
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- quiz_sessions RLS
create policy "Users can read own sessions" on quiz_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on quiz_sessions
  for insert with check (auth.uid() = user_id);

-- quiz_answers RLS
create policy "Users can read own answers" on quiz_answers
  for select using (auth.uid() = user_id);
create policy "Users can insert own answers" on quiz_answers
  for insert with check (auth.uid() = user_id);

-- user_badges RLS
create policy "Users can read own badges" on user_badges
  for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on user_badges
  for insert with check (auth.uid() = user_id);

-- user_question_stats RLS
create policy "Users can read own stats" on user_question_stats
  for select using (auth.uid() = user_id);
create policy "Users can insert own stats" on user_question_stats
  for insert with check (auth.uid() = user_id);
create policy "Users can update own stats" on user_question_stats
  for update using (auth.uid() = user_id);

-- リーダーボード用: 全ユーザーのXPを読める
create policy "Anyone can read leaderboard data" on profiles
  for select using (true);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at auto-update
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
  before update on profiles
  for each row execute function public.update_updated_at();
