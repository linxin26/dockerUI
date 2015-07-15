package main

import (
	"fmt"
	"html/template"
	"log" 
	"handler"
	"net/http"
) 

func render(w http.ResponseWriter, templName string) {
	tmpl, err := template.ParseFiles(templName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, "dockerUI")
	return
} 

func main() { 
	fmt.Println("dockerUI")
	fmt.Println(http.FileServer(http.Dir(".")))
     
	http.HandleFunc("/index", handler.Index)
	http.HandleFunc("/images", handler.Images)
	http.HandleFunc("/containers",handler.Containers)
	http.HandleFunc("/containersJson",handler.ContainersJson)
	http.HandleFunc("/system",handler.System)
	http.HandleFunc("/systemJson",handler.SystemJson)

	http.Handle("/static/", http.FileServer(http.Dir("../")))
	err := http.ListenAndServe(":18080", nil)
	if err != nil {
		log.Fatal("Listen:", err)
	}

}
