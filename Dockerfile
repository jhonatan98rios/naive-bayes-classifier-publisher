# docker build --pull -t jhonatan98rios/naive-bayes-classifier-publisher:0.0.1 .
# docker run -d -p 3001:3001 jhonatan98rios/naive-bayes-classifier-publisher:0.0.1
FROM oven/bun
COPY . .
RUN bun install
EXPOSE 3001
CMD ["bun", "src/index.ts"]