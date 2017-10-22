ALTER TABLE slack_message
DROP INDEX 'text';

ALTER TABLE slack_message
ADD INDEX 'text';

ALTER TABLE slack_message
DROP INDEX 'user';

ALTER TABLE slack_message
ADD INDEX 'user';
