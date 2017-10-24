/* Two ways to add indices on an existing table */

ALTER TABLE 'slack_messages'
DROP INDEX 'slack_messages_text_created';

ALTER TABLE 'slack_messages'
ADD INDEX 'slack_messages_text_created' ('user', 'created');

ALTER TABLE 'slack_messages'
DROP INDEX 'slack_messages_user_created';

CREATE INDEX 'slack_messages_user_created'
ON 'slack_messages' ('user', 'created');
