# i-note v0.0.0



- [Activity](#activity)
	- [Create activity](#create-activity)
	- [Delete activity](#delete-activity)
	- [Retrieve activities](#retrieve-activities)
	- [Update activity](#update-activity)
	
- [AssigneeRecommendation](#assigneerecommendation)
	- [Retrieve assignee recommendations](#retrieve-assignee-recommendations)
	
- [Auth](#auth)
	- [Authenticate](#authenticate)
	- [Authenticate with Google](#authenticate-with-google)
	
- [Category](#category)
	- [Create category](#create-category)
	- [Delete category](#delete-category)
	- [Retrieve categories](#retrieve-categories)
	- [Update category](#update-category)
	
- [Comment](#comment)
	- [Create comment](#create-comment)
	- [Delete comment](#delete-comment)
	- [Retrieve comments](#retrieve-comments)
	- [Update comment](#update-comment)
	
- [File](#file)
	- [Create file](#create-file)
	- [Retrieve files](#retrieve-files)
	- [Update file](#update-file)
	
- [Interest](#interest)
	- [Create interest](#create-interest)
	- [Delete interest](#delete-interest)
	- [Retrieve interests](#retrieve-interests)
	- [Update interest](#update-interest)
	
- [Job](#job)
	- [Create job](#create-job)
	- [Delete job](#delete-job)
	- [Retrieve jobs](#retrieve-jobs)
	- [Update job](#update-job)
	
- [Message](#message)
	- [Create message](#create-message)
	- [Delete message](#delete-message)
	- [Retrieve messages](#retrieve-messages)
	- [Update message](#update-message)
	
- [Milestone](#milestone)
	- [Create milestone](#create-milestone)
	- [Delete milestone](#delete-milestone)
	- [Retrieve milestones](#retrieve-milestones)
	- [Update milestone](#update-milestone)
	
- [Note](#note)
	- [Create note](#create-note)
	- [Delete note](#delete-note)
	- [Retrieve note](#retrieve-note)
	- [Retrieve notes](#retrieve-notes)
	- [Update note](#update-note)
	
- [Notification](#notification)
	- [Create notification](#create-notification)
	- [Retrieve notifications](#retrieve-notifications)
	
- [PasswordReset](#passwordreset)
	- [Send email](#send-email)
	- [Submit password](#submit-password)
	- [Verify token](#verify-token)
	
- [Project](#project)
	- [Create project](#create-project)
	- [Delete project](#delete-project)
	- [Retrieve project](#retrieve-project)
	- [Retrieve projects](#retrieve-projects)
	- [Update project](#update-project)
	
- [Reminder](#reminder)
	- [Create reminder](#create-reminder)
	- [Delete reminder](#delete-reminder)
	- [Retrieve reminders](#retrieve-reminders)
	- [Update reminder](#update-reminder)
	
- [Task](#task)
	- [Create task](#create-task)
	- [Delete task](#delete-task)
	- [Retrieve task](#retrieve-task)
	- [Retrieve tasks](#retrieve-tasks)
	- [Update task](#update-task)
	
- [TaskReview](#taskreview)
	- [Create task review](#create-task-review)
	- [Delete task review](#delete-task-review)
	- [Retrieve task reviews](#retrieve-task-reviews)
	- [Update task review](#update-task-review)
	
- [User](#user)
	- [Create user](#create-user)
	- [Delete user](#delete-user)
	- [Retrieve current user](#retrieve-current-user)
	- [Retrieve user](#retrieve-user)
	- [Retrieve users](#retrieve-users)
	- [Update password](#update-password)
	- [Update user](#update-user)
	


# Activity

## Create activity



	POST /activities


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Activity's name.</p>							|
| order			| 			|  <p>Activity's order.</p>							|
| delete_flag			| 			|  <p>Activity's delete_flag.</p>							|

## Delete activity



	DELETE /activities/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve activities



	GET /activities


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update activity



	PUT /activities/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Activity's name.</p>							|
| order			| 			|  <p>Activity's order.</p>							|
| delete_flag			| 			|  <p>Activity's delete_flag.</p>							|

# AssigneeRecommendation

## Retrieve assignee recommendations



	GET /assignee_recommendations


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

# Auth

## Authenticate



	POST /auth

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization			| String			|  <p>Basic authorization with email and password.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>Master access_token.</p>							|

## Authenticate with Google



	POST /auth/google


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>Google user accessToken.</p>							|

# Category

## Create category



	POST /categories


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| 			|  <p>Category's name.</p>							|
| isHide			| 			|  <p>Category's isHide.</p>							|
| deleted_flag			| 			|  <p>Category's deleted_flag.</p>							|
| order			| 			|  <p>Category's order.</p>							|

## Delete category



	DELETE /categories/:id


## Retrieve categories



	GET /categories


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update category



	PUT /categories/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| 			|  <p>Category's name.</p>							|
| isHide			| 			|  <p>Category's isHide.</p>							|
| deleted_flag			| 			|  <p>Category's deleted_flag.</p>							|
| order			| 			|  <p>Category's order.</p>							|

# Comment

## Create comment



	POST /comments


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| content			| 			|  <p>Comment's content.</p>							|
| task			| 			|  <p>Comment's task.</p>							|
| parent			| 			|  <p>Comment's parent.</p>							|
| deleted_flag			| 			|  <p>Comment's deleted_flag.</p>							|

## Delete comment



	DELETE /comments/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve comments



	GET /comments


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update comment



	PUT /comments/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| content			| 			|  <p>Comment's content.</p>							|
| task			| 			|  <p>Comment's task.</p>							|
| parent			| 			|  <p>Comment's parent.</p>							|
| deleted_flag			| 			|  <p>Comment's deleted_flag.</p>							|

# File

## Create file



	POST /files


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>File's name.</p>							|
| url			| 			|  <p>File's url.</p>							|
| size			| 			|  <p>File's size.</p>							|

## Retrieve files



	GET /files


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update file



	PUT /files/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>File's name.</p>							|
| url			| 			|  <p>File's url.</p>							|
| size			| 			|  <p>File's size.</p>							|

# Interest

## Create interest



	POST /interests


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| 			|  <p>Interest's name.</p>							|
| deleted_flag			| 			|  <p>Interest's deleted_flag.</p>							|

## Delete interest



	DELETE /interests/:id


## Retrieve interests



	GET /interests


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update interest



	PUT /interests/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| name			| 			|  <p>Interest's name.</p>							|
| deleted_flag			| 			|  <p>Interest's deleted_flag.</p>							|

# Job

## Create job



	POST /jobs


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>deleted_flag Job's name deleted_flag.</p>							|

## Delete job



	DELETE /jobs/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve jobs



	GET /jobs


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update job



	PUT /jobs/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>deleted_flag Job's name deleted_flag.</p>							|

# Message

## Create message



	POST /messages


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>Message's project.</p>							|
| reply_to			| 			|  <p>Message's reply_to.</p>							|
| content			| 			|  <p>Message's content.</p>							|
| deleted_flag			| 			|  <p>Message's deleted_flag.</p>							|
| type			| 			|  <p>Message's type.</p>							|

## Delete message



	DELETE /messages/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve messages



	GET /messages


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update message



	PUT /messages/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>Message's project.</p>							|
| reply_to			| 			|  <p>Message's reply_to.</p>							|
| content			| 			|  <p>Message's content.</p>							|
| deleted_flag			| 			|  <p>Message's deleted_flag.</p>							|
| type			| 			|  <p>Message's type.</p>							|

# Milestone

## Create milestone



	POST /milestones


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Milestone's name.</p>							|
| project			| 			|  <p>Milestone's project.</p>							|
| deleted_flag			| 			|  <p>Milestone's deleted_flag.</p>							|

## Delete milestone



	DELETE /milestones/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve milestones



	GET /milestones


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update milestone



	PUT /milestones/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Milestone's name.</p>							|
| project			| 			|  <p>Milestone's project.</p>							|
| deleted_flag			| 			|  <p>Milestone's deleted_flag.</p>							|

# Note

## Create note



	POST /notes


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| title			| 			|  <p>Note's title.</p>							|
| icon			| 			|  <p>Note's icon.</p>							|
| content			| 			|  <p>Note's content.</p>							|
| category			| 			|  <p>Note's category.</p>							|
| opened_at			| 			|  <p>Note's opened_at.</p>							|
| starred			| 			|  <p>Note's starred.</p>							|
| deleted_flag			| 			|  <p>Note's deleted_flag.</p>							|

## Delete note



	DELETE /notes/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve note



	GET /notes/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve notes



	GET /notes


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update note



	PUT /notes/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| title			| 			|  <p>Note's title.</p>							|
| icon			| 			|  <p>Note's icon.</p>							|
| content			| 			|  <p>Note's content.</p>							|
| category			| 			|  <p>Note's category.</p>							|
| opened_at			| 			|  <p>Note's opened_at.</p>							|
| starred			| 			|  <p>Note's starred.</p>							|
| deleted_flag			| 			|  <p>Note's deleted_flag.</p>							|

# Notification

## Create notification



	POST /notifications


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>admin access token.</p>							|
| content			| 			|  <p>Notification's content.</p>							|
| isSeen			| 			|  <p>Notification's isSeen.</p>							|
| type			| 			|  <p>Notification's type.</p>							|
| isSystem			| 			|  <p>Notification's isSystem.</p>							|
| author			| 			|  <p>Notification's author.</p>							|
| receiver			| 			|  <p>Notification's receiver.</p>							|
| deleted_flag			| 			|  <p>Notification's deleted_flag.</p>							|

## Retrieve notifications



	GET /notifications


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>admin access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

# PasswordReset

## Send email



	POST /password-resets


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| email			| String			|  <p>Email address to receive the password reset token.</p>							|
| link			| String			|  <p>Link to redirect user.</p>							|

## Submit password



	PUT /password-resets/:token


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| password			| String			|  <p>User's new password.</p>							|

## Verify token



	GET /password-resets/:token


# Project

## Create project



	POST /projects


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Project's name.</p>							|
| icon			| 			|  <p>Project's icon.</p>							|
| acronym			| 			|  <p>Project's acronym.</p>							|
| host			| 			|  <p>Project's host.</p>							|
| author			| 			|  <p>Project's author.</p>							|
| sprintlength			| 			|  <p>Project's sprintlength.</p>							|
| status			| 			|  <p>Project's status.</p>							|
| members			| 			|  <p>Project's members.</p>							|
| deleted_flag			| 			|  <p>Project's deleted_flag.</p>							|

## Delete project



	DELETE /projects/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve project



	GET /projects/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve projects



	GET /projects


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update project



	PUT /projects/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| name			| 			|  <p>Project's name.</p>							|
| icon			| 			|  <p>Project's icon.</p>							|
| acronym			| 			|  <p>Project's acronym.</p>							|
| host			| 			|  <p>Project's host.</p>							|
| author			| 			|  <p>Project's author.</p>							|
| sprintlength			| 			|  <p>Project's sprintlength.</p>							|
| status			| 			|  <p>Project's status.</p>							|
| members			| 			|  <p>Project's members.</p>							|
| deleted_flag			| 			|  <p>Project's deleted_flag.</p>							|

# Reminder

## Create reminder



	POST /reminders


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| title			| 			|  <p>Reminder's title.</p>							|
| content			| 			|  <p>Reminder's content.</p>							|
| time			| 			|  <p>Reminder's time.</p>							|
| is_done			| 			|  <p>Reminder's is_done.</p>							|
| is_remind			| 			|  <p>Reminder's is_remind.</p>							|
| deleted_flag			| 			|  <p>Reminder's deleted_flag.</p>							|

## Delete reminder



	DELETE /reminders/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve reminders



	GET /reminders


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update reminder



	PUT /reminders/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| title			| 			|  <p>Reminder's title.</p>							|
| content			| 			|  <p>Reminder's content.</p>							|
| time			| 			|  <p>Reminder's time.</p>							|
| is_done			| 			|  <p>Reminder's is_done.</p>							|
| is_remind			| 			|  <p>Reminder's is_remind.</p>							|
| deleted_flag			| 			|  <p>Reminder's deleted_flag.</p>							|

# Task

## Create task



	POST /tasks


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>Task's project.</p>							|
| parent			| 			|  <p>Task's parent.</p>							|
| code			| 			|  <p>Task's code.</p>							|
| description			| 			|  <p>Task's description.</p>							|
| subject			| 			|  <p>Task's subject.</p>							|
| assignee			| 			|  <p>Task's assignee.</p>							|
| status			| 			|  <p>Task's status.</p>							|
| priorty			| 			|  <p>Task's priorty.</p>							|
| milestone			| 			|  <p>Task's milestone.</p>							|
| estimate			| 			|  <p>Task's estimate.</p>							|
| actual			| 			|  <p>Task's actual.</p>							|
| startDate			| 			|  <p>Task's startDate.</p>							|
| dueDate			| 			|  <p>Task's dueDate.</p>							|
| endDate			| 			|  <p>Task's endDate.</p>							|
| opened_at			| 			|  <p>Task's opened_at.</p>							|
| deleted_flag			| 			|  <p>Task's deleted_flag.</p>							|
| reminderFlag			| 			|  <p>Task's reminderFlag.</p>							|

## Delete task



	DELETE /tasks/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve task



	GET /tasks/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve tasks



	GET /tasks


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update task



	PUT /tasks/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>Task's project.</p>							|
| parent			| 			|  <p>Task's parent.</p>							|
| code			| 			|  <p>Task's code.</p>							|
| description			| 			|  <p>Task's description.</p>							|
| subject			| 			|  <p>Task's subject.</p>							|
| assignee			| 			|  <p>Task's assignee.</p>							|
| status			| 			|  <p>Task's status.</p>							|
| priorty			| 			|  <p>Task's priorty.</p>							|
| milestone			| 			|  <p>Task's milestone.</p>							|
| estimate			| 			|  <p>Task's estimate.</p>							|
| actual			| 			|  <p>Task's actual.</p>							|
| startDate			| 			|  <p>Task's startDate.</p>							|
| dueDate			| 			|  <p>Task's dueDate.</p>							|
| endDate			| 			|  <p>Task's endDate.</p>							|
| opened_at			| 			|  <p>Task's opened_at.</p>							|
| deleted_flag			| 			|  <p>Task's deleted_flag.</p>							|
| reminderFlag			| 			|  <p>Task's reminderFlag.</p>							|

# TaskReview

## Create task review



	POST /task_reviews


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>task point text Task review's project task point text.</p>							|

## Delete task review



	DELETE /task_reviews/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|

## Retrieve task reviews



	GET /task_reviews


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update task review



	PUT /task_reviews/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>user access token.</p>							|
| project			| 			|  <p>task point text Task review's project task point text.</p>							|

# User

## Create user



	POST /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>Master access_token.</p>							|
| email			| String			|  <p>User's email.</p>							|
| password			| String			|  <p>User's password.</p>							|
| name			| String			| **optional** <p>User's name.</p>							|
| picture			| String			| **optional** <p>User's picture.</p>							|
| role			| String			| **optional** <p>User's role.</p>							|

## Delete user



	DELETE /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|

## Retrieve current user



	GET /users/me


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|

## Retrieve user



	GET /users/:id


## Retrieve users



	GET /users


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|
| q			| String			| **optional** <p>Query to search.</p>							|
| page			| Number			| **optional** <p>Page number.</p>							|
| limit			| Number			| **optional** <p>Amount of returned items.</p>							|
| sort			| String[]			| **optional** <p>Order of returned items.</p>							|
| fields			| String[]			| **optional** <p>Fields to be returned.</p>							|

## Update password



	PUT /users/:id/password

### Headers

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| Authorization			| String			|  <p>Basic authorization with email and password.</p>							|

### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| password			| String			|  <p>User's new password.</p>							|

## Update user



	PUT /users/:id


### Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| access_token			| String			|  <p>User access_token.</p>							|
| name			| String			| **optional** <p>User's name.</p>							|
| picture			| String			| **optional** <p>User's picture.</p>							|


