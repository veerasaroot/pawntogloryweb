-- Create the 'images' bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('images', 'images', true)
on conflict (id) do nothing;

-- Public Access Policy
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'images' );

-- Authenticated Upload Policy
create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- Authenticated Delete Policy (Optional, for cleanup)
create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'images' and auth.role() = 'authenticated' );
