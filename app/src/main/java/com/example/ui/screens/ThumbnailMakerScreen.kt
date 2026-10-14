package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.StudioViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThumbnailMakerScreen(
    viewModel: StudioViewModel,
    onBack: () -> Unit
) {
    var aspectRatio by remember { mutableStateOf("16:9 (YouTube)") }
    var headlineText by remember { mutableStateOf("VIRAL HINDI VLOG!") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Thumbnail Maker", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBack, modifier = Modifier.testTag("back_button")) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    Button(onClick = { }, modifier = Modifier.testTag("export_thumbnail_button")) {
                        Text("High-Res Export")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .background(Color.Black),
                contentAlignment = Alignment.Center
            ) {
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                    modifier = Modifier
                        .fillMaxWidth(0.85f)
                        .height(200.dp)
                ) {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            text = headlineText,
                            fontWeight = FontWeight.ExtraBold,
                            fontSize = 28.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }
                }
            }

            Surface(modifier = Modifier.fillMaxWidth(), tonalElevation = 8.dp) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Aspect Ratio:", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(selected = aspectRatio.contains("16:9"), onClick = { aspectRatio = "16:9 (YouTube)" }, label = { Text("YouTube 16:9") })
                        FilterChip(selected = aspectRatio.contains("9:16"), onClick = { aspectRatio = "9:16 (Shorts)" }, label = { Text("Shorts 9:16") })
                    }

                    OutlinedTextField(
                        value = headlineText,
                        onValueChange = { headlineText = it },
                        label = { Text("Headline / Text (Hindi/English)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}
