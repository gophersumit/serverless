tidy:
	go mod tidy
	npm install

deploy:
	cdk deploy --all

destroy:
	cdk destroy --all

test-api:
	curl -X PUT https://0loc28nej1.execute-api.us-east-1.amazonaws.com/dev/v1/events -d '{"event_id": "123", "consumer_id": "data:"{"name": "test"}}' 

diagram:
	cdk synth
	npx cdk-dia