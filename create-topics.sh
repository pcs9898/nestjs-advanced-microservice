#!/bin/bash
# Kafka 서비스가 시작될 때까지 대기
sleep 20
# 'nestjs' 토픽 생성
kafka-topics.sh --create --if-not-exists --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 --topic nestjs