tidy:
	go mod tidy
	npm install

deploy:
	cdk deploy --all

destroy:
	cdk destroy --all


diagram:
	cdk synth
	npx cdk-dia