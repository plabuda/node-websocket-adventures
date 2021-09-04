.PHONY:
host:
	konsole -e python server.py &

.PHONY:
host_local:
	konsole -e python server.py /secret.js /secret_mock.js &

.PHONY:
node:
	konsole -e node index.js &