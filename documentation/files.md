## **openWriteFile**
**Type**: `FilePath -> OutStream`

Opens an `OutStream` channel endpoint to a file specified by a path, in write mode.


## **openAppendFile**
**Type**: `FilePath -> OutStream`

Opens an `OutStream` channel endpoint to a file specified by a path, in append mode.


## **openReadFile**
**Type**: `FilePath -> InStream`

Opens an `InStream` channel endpoint to a file specified by a path, in read mode.


## **writeFile**
**Type**: `FilePath -> String -> ()`

Writes a string to a file specified by a path. 
Does the same as `openWriteFile fp |> hPutStr s |> hCloseOut`.


## **appendFile**
**Type**: `FilePath -> String -> ()`

Write a string to a file specified by a path. 
Does the same as `openAppendFile fp |> hPutStr s |> hCloseOut`.


## **readFile**
**Type**: `FilePath -> String`

Read the contents of a file specified by a path. Note that the string separates lines 
explicitely with the newline character `\n`.


