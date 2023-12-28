# General
cert := /mnt/c/Users/Desktop/.ssh/mongodb-ec2-pair-key.pem
dns := ec2-user@ec2-44-193-219-63.compute-1.amazonaws.com


# Targets
connect:
	sudo ssh -i "$(cert)" $(dns)
