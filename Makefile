.PHONY: docker-start mongo-start run

run-dev:
	npm run dev

run:
	npm run start

docker-start:
	systemctl --user start docker-desktop.service

mongo-start:
	docker run --name comp1842 -p 27017:27017 -d mongodb/mongodb-community-server:latest
