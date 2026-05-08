-- Public storage bucket for freelancer deliveries and chat attachments (large files allowed)
insert into storage.buckets (id, name, public, file_size_limit)
values ('deliveries', 'deliveries', true, 5368709120)
on conflict (id) do update set public = true, file_size_limit = 5368709120;

-- Anyone (incl. anon) can read public files
create policy "Public read deliveries"
on storage.objects for select
using (bucket_id = 'deliveries');

-- Anyone can upload (mock-data app, no auth yet)
create policy "Anyone can upload deliveries"
on storage.objects for insert
with check (bucket_id = 'deliveries');

-- Anyone can delete their own uploads (mock-data app)
create policy "Anyone can delete deliveries"
on storage.objects for delete
using (bucket_id = 'deliveries');