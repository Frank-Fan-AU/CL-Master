-- 创建更新时间戳的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建 user_generations 表
CREATE TABLE public.user_generations (
    id bigserial NOT NULL,
    user_id uuid NOT NULL,
    count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT user_generations_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_generations UNIQUE (user_id),
    CONSTRAINT user_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_generations_user_id ON public.user_generations USING btree (user_id) TABLESPACE pg_default;

-- 创建触发器
CREATE TRIGGER update_user_generations_updated_at
    BEFORE UPDATE ON user_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加 RLS 策略
ALTER TABLE public.user_generations ENABLE ROW LEVEL SECURITY;

-- 创建策略：用户只能查看和更新自己的记录
CREATE POLICY "Users can view their own generations"
    ON public.user_generations
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own generations"
    ON public.user_generations
    FOR UPDATE
    USING (auth.uid() = user_id);

-- 创建策略：允许服务角色完全访问
CREATE POLICY "Service role has full access"
    ON public.user_generations
    FOR ALL
    USING (auth.role() = 'service_role'); 